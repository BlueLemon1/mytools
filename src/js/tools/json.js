/** Parses and formats JSON using two-space indentation by default. */
export function formatJson(source, indentation = 2) {
    return JSON.stringify(JSON.parse(source), null, indentation);
}

/** Parses and minifies JSON. */
export function minifyJson(source) {
    return JSON.stringify(JSON.parse(source));
}

/** Returns whether the provided string contains valid JSON. */
export function validateJson(source) {
    try {
        JSON.parse(source);
        return true;
    } catch {
        return false;
    }
}
