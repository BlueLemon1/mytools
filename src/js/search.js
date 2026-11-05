/**
 * Filters tools by search query, category, and favorite state.
 */
export function filterTools(tools, query, category = 'all', favorites = []) {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return tools.filter((tool) => {
        const matchesCategory =
            category === 'all' ||
            (category === 'favorites'
                ? favorites.includes(tool.id)
                : tool.category === category);

        if (!matchesCategory) {
            return false;
        }

        if (!normalizedQuery) {
            return true;
        }

        const searchableText = [
            tool.nameKey,
            tool.descriptionKey,
            ...tool.keywords,
        ]
            .join(' ')
            .toLocaleLowerCase();

        return searchableText.includes(normalizedQuery);
    });
}

/**
 * Adds keyboard shortcuts for focusing the tool search field.
 */
export function installSearchShortcut(input) {
    document.addEventListener('keydown', (event) => {
        const target = event.target;
        const isTyping =
            target instanceof HTMLElement &&
            (target.isContentEditable ||
                ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            input.focus();
            input.select();
            return;
        }

        if (
            event.key === '/' &&
            !isTyping &&
            !event.ctrlKey &&
            !event.metaKey &&
            !event.altKey
        ) {
            event.preventDefault();
            input.focus();
        }
    });
}
