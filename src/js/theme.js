import { readStorage, writeStorage } from './storage.js';

const VALID_THEMES = ['auto', 'light', 'dark'];
const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';
const THEME_COLORS = {
    light: '#f4f6fa',
    dark: '#0d151d',
};

const colorScheme = window.matchMedia(COLOR_SCHEME_QUERY);
let currentTheme = 'auto';

function applyTheme() {
    const useDarkColors =
        currentTheme === 'dark' ||
        (currentTheme === 'auto' && colorScheme.matches);

    document.documentElement.dataset.theme = currentTheme;
    document.documentElement.style.colorScheme = useDarkColors ? 'dark' : 'light';

    const themeColorMeta = document.querySelector('meta[name="theme-color"]');

    if (themeColorMeta) {
        themeColorMeta.content = useDarkColors
            ? THEME_COLORS.dark
            : THEME_COLORS.light;
    }
}

function handleSystemThemeChange() {
    if (currentTheme === 'auto') {
        applyTheme();
    }
}

/** Initializes the saved theme and listens for operating-system theme changes. */
export function initTheme() {
    const savedTheme = readStorage('theme', 'auto');

    currentTheme = VALID_THEMES.includes(savedTheme) ? savedTheme : 'auto';
    applyTheme();

    colorScheme.addEventListener('change', handleSystemThemeChange);

    return currentTheme;
}

/** Sets and persists a valid theme preference. */
export function setTheme(theme) {
    if (!VALID_THEMES.includes(theme)) {
        return currentTheme;
    }

    currentTheme = theme;
    writeStorage('theme', currentTheme);
    applyTheme();

    return currentTheme;
}

export function getTheme() {
    return currentTheme;
}
