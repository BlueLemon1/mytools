/** Parses a date/time input and returns common representations. */
export function convertDateTime(source) {
    const timestamp = Date.parse(source.trim());
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
