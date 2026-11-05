/** Parses a date/time input and returns common representations. */
export function convertDateTime(source) {
    const value = source.trim();\n    const numeric = /^-?\\d+(?:\\.\\d+)?$/.test(value) ? Number(value) : null;\n    const timestamp = numeric === null\n        ? Date.parse(value)\n        : new Date(Math.abs(numeric) < 1e12 ? numeric * 1000 : numeric).getTime();
    if (!source.trim() || Number.isNaN(timestamp)) throw new Error('invalidDate');

    const date = new Date(timestamp);
    return [
        `ISO 8601: ${date.toISOString()}`,
        `Unix seconds: ${Math.floor(timestamp / 1000)}`,
        `Unix milliseconds: ${timestamp}`,
        `UTC: ${date.toUTCString()}`,
        `Local: ${date.toLocaleString()}`,
    ].join('\n');
}
