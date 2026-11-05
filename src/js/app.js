import { t, setLanguage, getLanguage } from './i18n.js';
import { initTheme, setTheme, getTheme } from './theme.js';
import { readStorage, writeStorage } from './storage.js';
import { filterTools, installSearchShortcut } from './search.js';
import { tools, getTool } from './tools/registry.js';

const SELECTORS = {
    app: '#app',
    dialog: '#dialog',
    search: '#search',
    input: '#input',
    result: '#result',
    grid: '#grid',
    recent: '#recent',
    empty: '#empty',
    categories: '#categories',
    actions: '#actions',
    favorite: '#fav',
    close: '#close',
    copy: '#copy',
    options: '#toolOptions',
};

const TOOL_ICONS = {
    calculator: '＋',
    json: '{ }',
    text: 'Aa',
    base64: '⇄',
    'json-schema': '{ }',
    'json-diff': '⇄',
    regex: '.*',
    jwt: 'JWT',
    xml: '</>',
    url: '↗',
    datetime: '◷',
};

const THEME_LABELS = {
    de: { auto: 'System', light: 'Hell', dark: 'Dunkel' },
    en: { auto: 'System', light: 'Light', dark: 'Dark' },
};

const $ = (selector, parent = document) => parent.querySelector(selector);

export function mountApp(root) {
    if (!root) {
        return;
    }

    initTheme();
    setLanguage(readStorage('language', 'de'));

    const state = {
        favorites: readStringList('favorites'),
        recent: readStringList('recent'),
        category: 'all',
        activeTool: null,
        returnFocus: null,
    };

    renderApplication(root);

    const elements = {
        dialog: $(SELECTORS.dialog),
        search: $(SELECTORS.search),
        input: $(SELECTORS.input),
        result: $(SELECTORS.result),
        grid: $(SELECTORS.grid),
        recent: $(SELECTORS.recent),
        empty: $(SELECTORS.empty),
        categories: $(SELECTORS.categories),
        actions: $(SELECTORS.actions),
        favorite: $(SELECTORS.favorite),
        close: $(SELECTORS.close),
        copy: $(SELECTORS.copy),
        options: $(SELECTORS.options),
    };

    bindEvents(elements, state);
    localizeInterface(elements, state);
    renderToolCollections(elements, state);
    installSearchShortcut(elements.search);

    handleToolHash(elements, state);
    window.addEventListener('hashchange', () => handleToolHash(elements, state));
}

/** Reads a stored list and ignores invalid values or non-string entries. */
function readStringList(key) {
    const value = readStorage(key, []);

    return Array.isArray(value)
        ? value.filter((item) => typeof item === 'string')
        : [];
}

/** Creates the static application shell. Dynamic tool content is rendered separately. */
function renderApplication(root) {
    root.innerHTML = `
        <div class="app-shell container-xl px-3">
            <header class="topbar d-flex justify-content-between align-items-center">
                <a class="brand" href="./">
                    <span class="brand-mark" aria-hidden="true">⌘</span>
                    MyTools
                </a>

                <div class="header-actions">
                    <span class="local-status">
                        ● <span data-i18n="local"></span>
                    </span>

                    <div class="preference-wrap" data-menu="language">
                        <button
                            class="preference-trigger"
                            type="button"
                            aria-haspopup="true"
                            aria-expanded="false"
                            aria-label="Language"
                        >
                            <span class="pref-trigger-icon language-flag" id="languageIcon" aria-hidden="true">🇩🇪</span>
                            <span class="visually-hidden" id="languageLabel">DE</span>
                        </button>

                        <div class="preference-menu" role="menu" hidden>
                            <button type="button" role="menuitemradio" data-value="de">
                                <span class="menu-flag" aria-hidden="true">🇩🇪</span>
                                <span>Deutsch</span>
                                <span class="menu-check" aria-hidden="true">✓</span>
                            </button>
                            <button type="button" role="menuitemradio" data-value="en">
                                <span class="menu-flag" aria-hidden="true">🇬🇧</span>
                                <span>English</span>
                                <span class="menu-check" aria-hidden="true">✓</span>
                            </button>
                        </div>
                    </div>

                    <div class="preference-wrap" data-menu="theme">
                        <button
                            class="preference-trigger"
                            type="button"
                            aria-haspopup="true"
                            aria-expanded="false"
                            aria-label="Appearance"
                        >
                            <span class="pref-trigger-icon" id="themeIcon" aria-hidden="true">
                                <svg viewBox="0 0 24 24">
                                    <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.6 8.6 0 1 0 20.5 14.2Z"></path>
                                </svg>
                            </span>
                            <span class="visually-hidden" id="themeLabel"></span>
                        </button>

                        <div class="preference-menu" role="menu" hidden>
                            <button type="button" role="menuitemradio" data-value="auto">
                                <span class="menu-choice-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"></circle><path d="M12 4v16"></path></svg></span>
                                <span data-i18n="auto"></span>
                                <span class="menu-check" aria-hidden="true">✓</span>
                            </button>
                            <button type="button" role="menuitemradio" data-value="light">
                                <span class="menu-choice-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"></path></svg></span>
                                <span data-i18n="light"></span>
                                <span class="menu-check" aria-hidden="true">✓</span>
                            </button>
                            <button type="button" role="menuitemradio" data-value="dark">
                                <span class="menu-choice-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.6 8.6 0 1 0 20.5 14.2Z"></path></svg></span>
                                <span data-i18n="dark"></span>
                                <span class="menu-check" aria-hidden="true">✓</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <section class="hero">
                <div class="eyebrow" data-i18n="eyebrow"></div>
                <h1>
                    <span data-i18n="headlineA"></span><br>
                    <span class="hero-accent" data-i18n="headlineB"></span>
                </h1>
                <p data-i18n="intro"></p>
                <div class="hero-meta">
                    ✦ <span data-i18n="local"></span> ·
                    ${tools.length} <span data-i18n="allTools"></span>
                </div>
                <div class="hero-orbit" aria-hidden="true"></div>
            </section>

            <main>
                <div class="section-top">
                    <div>
                        <p class="section-kicker">WORKSPACE</p>
                        <h2 data-i18n="allTools"></h2>
                    </div>

                    <label class="search-box">
                        <span class="search-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                                <circle cx="10.8" cy="10.8" r="6.8"></circle>
                                <path d="m16 16 4.2 4.2"></path>
                            </svg>
                        </span>
                        <input
                            id="search"
                            type="search"
                            data-i18n-placeholder="searchPlaceholder"
                            aria-label="Search tools"
                        >
                        <kbd>Ctrl K</kbd>
                    </label>
                </div>

                <nav class="category-tabs" id="categories" aria-label="Tool categories">
                    <button class="category-tab active" type="button" data-cat="all" data-i18n="categoryAll" aria-pressed="true"></button>
                    <button class="category-tab" type="button" data-cat="text" data-i18n="categoryText" aria-pressed="false"></button>
                    <button class="category-tab" type="button" data-cat="dev" data-i18n="categoryDev" aria-pressed="false"></button>
                    <button class="category-tab" type="button" data-cat="utility" data-i18n="categoryUtility" aria-pressed="false"></button>
                    <button class="category-tab" type="button" data-cat="favorites" data-i18n="favorites" aria-pressed="false"></button>
                </nav>

                <div id="grid" class="tool-grid"></div>
                <p id="empty" hidden data-i18n="noResults"></p>

                <section class="quick-sections">
                    <h2 data-i18n="recent"></h2>
                    <div id="recent" class="recent-grid"></div>
                </section>
            </main>

            <footer class="footer">
                <strong>⌘ MyTools</strong>
                <span data-i18n="privacy"></span>
                <span>© 2026</span>
            </footer>
        </div>

        <dialog id="dialog" class="tool-dialog" aria-labelledby="toolTitle">
            <div class="dialog-top">
                <div class="dialog-heading">
                    <div id="toolIcon" class="dialog-icon" aria-hidden="true"></div>
                    <div>
                        <h2 id="toolTitle"></h2>
                        <p id="hint"></p>
                    </div>
                </div>

                <div class="dialog-controls">
                    <button id="fav" class="icon-button" type="button" aria-label="Favorite">☆</button>
                    <button id="close" class="icon-button" type="button" aria-label="Close">×</button>
                </div>
            </div>

            <div class="dialog-body">
                <label class="field-label" for="input" data-i18n="input"></label>
                <textarea id="input" class="tool-input"></textarea>

                <div id="toolOptions" class="tool-options"></div>\n                <div id="actions" class="action-row"></div>

                <div class="result-heading">
                    <label class="field-label" for="result" data-i18n="output"></label>
                    <button id="copy" class="copy-button" type="button" data-i18n="copy"></button>
                </div>
                <pre id="result" class="tool-result" aria-live="polite"></pre>
            </div>
        </dialog>
    `;
}

/** Connects UI events once, using delegation for dynamic content. */
function bindEvents(elements, state) {
    elements.grid.addEventListener('click', (event) => {
        const button = event.target.closest('[data-open]');

        if (button) {
            openTool(button.dataset.open, button, elements, state);
        }
    });

    elements.recent.addEventListener('click', (event) => {
        const button = event.target.closest('[data-open]');

        if (button) {
            openTool(button.dataset.open, button, elements, state);
        }
    });

    elements.actions.addEventListener('click', (event) => {
        const button = event.target.closest('[data-action]');
        const action = state.activeTool?.actions.find(
            (item) => item.id === button?.dataset.action,
        );

        if (!action) {
            return;
        }

        try {
            elements.result.textContent = action.run(
                elements.input.value,
                getLanguage(),
                t,
                getToolOptions(elements.options),
            );
        } catch (error) {
            elements.result.textContent = getToolErrorMessage(error);
        }
    });

    elements.close.addEventListener('click', () => closeTool(elements, state));
    elements.dialog.addEventListener('click', (event) => {
        if (event.target === elements.dialog) {
            closeTool(elements, state);
        }
    });

    elements.dialog.addEventListener('close', () => {
        state.activeTool = null;

        if (state.returnFocus?.focus) {
            state.returnFocus.focus();
        }

        state.returnFocus = null;

        if (location.hash.startsWith('#tool=')) {
            history.replaceState(null, '', location.pathname);
        }
    });

    elements.favorite.addEventListener('click', () => {
        if (!state.activeTool) {
            return;
        }

        toggleFavorite(state.activeTool.id, elements, state);
    });

    elements.copy.addEventListener('click', () => copyResult(elements.copy, elements.result));

    elements.search.addEventListener('input', () => {
        renderToolCollections(elements, state);
    });

    elements.categories.addEventListener('click', (event) => {
        const button = event.target.closest('[data-cat]');

        if (!button) {
            return;
        }

        state.category = button.dataset.cat;
        updateCategorySelection(elements.categories, state.category);
        renderToolCollections(elements, state);
    });

    bindPreferenceMenus(elements, state);
}

/** Opens a tool dialog and records the tool in the recent list. */
function openTool(toolId, trigger, elements, state) {
    const tool = getTool(toolId);

    if (!tool) {
        return;
    }

    state.activeTool = tool;
    state.returnFocus = trigger ?? document.activeElement;
    state.recent = [toolId, ...state.recent.filter((id) => id !== toolId)].slice(0, 5);

    writeStorage('recent', state.recent);

    $('#toolIcon').textContent = TOOL_ICONS[toolId] ?? '';
    $('#toolTitle').textContent = t(tool.nameKey);
    $('#hint').textContent = t(tool.hintKey);

    elements.input.value = '';
    elements.input.placeholder = t(tool.placeholderKey);
    elements.result.textContent = t('emptyResult');

    updateFavoriteButton(elements.favorite, state);
    renderToolOptions(elements.options, tool);    renderToolActions(elements.actions, tool);
    elements.dialog.showModal();
    elements.input.focus();

    renderRecentTools(elements.recent, state);

    history.replaceState(null, '', `#tool=${toolId}`);
}

/** Closes the active dialog. The dialog's close event restores focus. */
function closeTool(elements, state) {
    if (elements.dialog.open) {
        elements.dialog.close();
    }

    state.activeTool = null;
}

/** Adds or removes the active tool from the persisted favorites. */
function toggleFavorite(toolId, elements, state) {
    const isFavorite = state.favorites.includes(toolId);

    state.favorites = isFavorite
        ? state.favorites.filter((id) => id !== toolId)
        : [...state.favorites, toolId];

    writeStorage('favorites', state.favorites);
    updateFavoriteButton(elements.favorite, state);
    renderToolCollections(elements, state);
}

/** Keeps the favorite button's icon and accessible name in sync. */
function updateFavoriteButton(button, state) {
    if (!state.activeTool) {
        return;
    }

    const isFavorite = state.favorites.includes(state.activeTool.id);

    button.textContent = isFavorite ? '★' : '☆';
    button.setAttribute('aria-label', t(isFavorite ? 'unfavorite' : 'favorite'));
}


/** Renders optional, tool-specific controls without changing the shared dialog. */
function renderToolOptions(container, tool) {
    const optionMarkup = {
        'json-schema': `
            <label class="tool-option"><input id="schemaOmitTypes" type="checkbox"> <span>${t('schemaOmitTypes')}</span></label>
            <label class="tool-option"><input id="schemaAllRequired" type="checkbox" checked> <span>${t('schemaAllRequired')}</span></label>
        `,
        'json-diff': `
            <label class="field-label" for="compareInput">${t('compareInput')}</label>
            <textarea id="compareInput" class="tool-input" placeholder='{"example":true}'></textarea>
        `,
        regex: `
            <label class="field-label" for="regexPattern">${t('regexPattern')}</label>
            <input id="regexPattern" class="tool-option-input" type="text" placeholder="\\\\d+">
            <label class="field-label" for="regexFlags">${t('regexFlags')}</label>
            <input id="regexFlags" class="tool-option-input" type="text" value="gm">
        `,
    };

    container.innerHTML = optionMarkup[tool.id] ?? '';
}

/** Collects optional values for tools that need more than the main input. */
function getToolOptions(container) {
    return {
        omitTypes: $('#schemaOmitTypes', container)?.checked ?? false,
        allRequired: $('#schemaAllRequired', container)?.checked ?? true,
        compareInput: $('#compareInput', container)?.value ?? '',
        pattern: $('#regexPattern', container)?.value ?? '',
        flags: $('#regexFlags', container)?.value ?? 'gm',
    };
}

/** Builds the available action buttons for the selected tool. */
function renderToolActions(container, tool) {
    container.innerHTML = tool.actions
        .map((action) => {
            const buttonClass = action.primary ? 'action-button primary' : 'action-button';

            return `
                <button
                    class="${buttonClass}"
                    type="button"
                    data-action="${action.id}"
                >
                    ${t(action.labelKey)}
                </button>
            `;
        })
        .join('');
}

/** Displays a localized message for known tool errors. */
function getToolErrorMessage(error) {
    const errorMessages = {
        zero: 'calcZero',
        empty: 'calcEmpty',
        syntax: 'calcInvalid',
        invalidJson: 'invalidJson',
        invalidJwt: 'invalidJwt',
        invalidXml: 'invalidXml',
        invalidUrl: 'invalidUrl',
        invalidDate: 'invalidDate',
        regexPatternRequired: 'regexPatternRequired',
    };

    return errorMessages[error.message]
        ? t(errorMessages[error.message])
        : error.message || t('calcInvalid');
}

/** Copies the current result and briefly updates the button label. */
async function copyResult(button, result) {
    try {
        await navigator.clipboard.writeText(result.textContent);
        button.textContent = t('copied');
    } catch {
        button.textContent = t('copyFailed');
    }
}

/** Renders the filtered tool cards and recent tools. */
function renderToolCollections(elements, state) {
    const visibleTools = filterTools(
        tools,
        elements.search.value,
        state.category,
        state.favorites,
    );

    elements.grid.innerHTML = visibleTools.map((tool) => renderToolCard(tool, state)).join('');
    elements.empty.hidden = visibleTools.length > 0;
    elements.empty.textContent = state.category === 'favorites'
        ? t('emptyFavorites')
        : t('noResults');

    renderRecentTools(elements.recent, state);
}

/** Returns the markup for one tool card. */
function renderToolCard(tool, state) {
    const categoryKey = getCategoryTranslationKey(tool.category);
    const icon = TOOL_ICONS[tool.id] ?? '';
    const favoriteIcon = state.favorites.includes(tool.id) ? '★' : '☆';

    return `
        <button
            class="tool-card"
            type="button"
            data-open="${tool.id}"
            aria-label="${t('open')} ${t(tool.nameKey)}"
        >
            <span class="tool-card-top">
                <span class="tool-icon" aria-hidden="true">${icon}</span>
                <span aria-hidden="true">↗</span>
            </span>
            <b class="tool-card-title">${t(tool.nameKey)}</b>
            <span class="tool-card-description">${t(tool.descriptionKey)}</span>
            <span class="tool-card-bottom">
                <small>${t(categoryKey)}</small>
                <span aria-hidden="true">${favoriteIcon}</span>
            </span>
        </button>
    `;
}

/** Returns the translation key for a tool category. */
function getCategoryTranslationKey(category) {
    const categoryKeys = {
        dev: 'categoryDev',
        text: 'categoryText',
        utility: 'categoryUtility',
    };

    return categoryKeys[category] ?? 'categoryUtility';
}

/** Renders the recently opened tools. */
function renderRecentTools(container, state) {
    const recentTools = state.recent
        .slice(0, 3)
        .map(getTool)
        .filter(Boolean);

    if (recentTools.length === 0) {
        container.textContent = t('emptyRecent');
        return;
    }

    container.innerHTML = recentTools
        .map((tool) => `
            <button
                class="recent-item"
                type="button"
                data-open="${tool.id}"
                aria-label="${t('open')} ${t(tool.nameKey)}"
            >
                <span class="recent-icon" aria-hidden="true">${TOOL_ICONS[tool.id] ?? ''}</span>
                <span>${t(tool.nameKey)}</span>
            </button>
        `)
        .join('');
}

/** Applies active state and ARIA state to the category buttons. */
function updateCategorySelection(container, selectedCategory) {
    container.querySelectorAll('[data-cat]').forEach((button) => {
        const isSelected = button.dataset.cat === selectedCategory;

        button.classList.toggle('active', isSelected);
        button.setAttribute('aria-pressed', String(isSelected));
    });
}

/** Updates all translated text and controls after a language change. */
function localizeInterface(elements, state) {
    document.querySelectorAll('[data-i18n]').forEach((element) => {
        element.textContent = t(element.dataset.i18n);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
        element.placeholder = t(element.dataset.i18nPlaceholder);
    });

    elements.search.setAttribute('aria-label', t('searchLabel'));
    elements.close.setAttribute('aria-label', t('close'));

    if (state.activeTool) {
        $('#toolTitle').textContent = t(state.activeTool.nameKey);
        $('#hint').textContent = t(state.activeTool.hintKey);
        elements.input.placeholder = t(state.activeTool.placeholderKey);
        renderToolOptions(elements.options, state.activeTool);
        renderToolActions(elements.actions, state.activeTool);
        updateFavoriteButton(elements.favorite, state);
    }

    updatePreferenceMenus();
    renderToolCollections(elements, state);
}

/** Updates the labels and selected state of both preference menus. */
/** Connects language and theme popovers, including keyboard navigation. */
function bindPreferenceMenus(elements, state) {
    document.querySelectorAll('.preference-wrap').forEach((wrapper) => {
        const trigger = $('.preference-trigger', wrapper);
        const menu = $('.preference-menu', wrapper);

        trigger.addEventListener('click', () => {
            togglePreferenceMenu(wrapper);
        });

        menu.addEventListener('click', (event) => {
            const option = event.target.closest('[data-value]');

            if (!option) {
                return;
            }

            if (wrapper.dataset.menu === 'language') {
                setLanguage(option.dataset.value);
                writeStorage('language', getLanguage());
                localizeInterface(elements, state);
            } else {
                setTheme(option.dataset.value);
                updatePreferenceMenus();
            }

            closePreferenceMenu(wrapper, true);
        });

        menu.addEventListener('keydown', (event) => {
            handleMenuKeyboard(event, menu);
        });

        trigger.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                openPreferenceMenu(wrapper);
                $('[data-value]', menu)?.focus();
            }
        });
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.preference-wrap')) {
            closeAllPreferenceMenus();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeAllPreferenceMenus(true);
        }
    });
}

function togglePreferenceMenu(wrapper) {
    const menu = $('.preference-menu', wrapper);

    if (menu.hidden) {
        closeAllPreferenceMenus();
        openPreferenceMenu(wrapper);
    } else {
        closePreferenceMenu(wrapper);
    }
}

function openPreferenceMenu(wrapper) {
    const menu = $('.preference-menu', wrapper);
    const trigger = $('.preference-trigger', wrapper);

    menu.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
}

function closePreferenceMenu(wrapper, restoreFocus = false) {
    const menu = $('.preference-menu', wrapper);
    const trigger = $('.preference-trigger', wrapper);

    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');

    if (restoreFocus) {
        trigger.focus();
    }
}

function closeAllPreferenceMenus(restoreFocus = false) {
    document.querySelectorAll('.preference-wrap').forEach((wrapper) => {
        const menu = $('.preference-menu', wrapper);

        if (!menu.hidden) {
            closePreferenceMenu(wrapper, restoreFocus);
        }
    });
}

function handleMenuKeyboard(event, menu) {
    const items = [...menu.querySelectorAll('[data-value]')];
    const currentIndex = items.indexOf(document.activeElement);
    let nextItem;

    switch (event.key) {
        case 'ArrowDown':
            nextItem = items[(currentIndex + 1) % items.length];
            break;
        case 'ArrowUp':
            nextItem = items[(currentIndex - 1 + items.length) % items.length];
            break;
        case 'Home':
            nextItem = items[0];
            break;
        case 'End':
            nextItem = items[items.length - 1];
            break;
        default:
            return;
    }

    event.preventDefault();
    nextItem?.focus();
}

/** Opens a tool when a valid tool ID is present in the URL hash. */
function handleToolHash(elements, state) {
    const toolId = location.hash.startsWith('#tool=')
        ? location.hash.slice('#tool='.length)
        : '';

    if (toolId && !elements.dialog.open) {
        openTool(toolId, null, elements, state);
    }
}
