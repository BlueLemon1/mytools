const STORAGE_PREFIX = 'mytools:v2:';

/**
 * Reads a JSON value from localStorage.
 * Returns the supplied fallback if storage is unavailable or the value is invalid.
 */
export function readStorage(key, fallback) {
    try {
        const storedValue = localStorage.getItem(STORAGE_PREFIX + key);
        return storedValue === null ? fallback : JSON.parse(storedValue);
    } catch {
        return fallback;
    }
}

/**
 * Writes a JSON value to localStorage.
 * Returns false when storage is unavailable or quota is exceeded.
 */
export function writeStorage(key, value) {
    try {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
        return true;
    } catch {
        return false;
    }
}
