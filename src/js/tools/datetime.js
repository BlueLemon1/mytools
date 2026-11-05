/** Parses ISO/date strings or Unix seconds/milliseconds into common representations. */
export function convertDateTime(source) {
    const value = source.trim();
    const numeric = /^-?\d+(?:\.\d+)?$/.test(value) ? Number(value) : null;
    const timestamp = numeric === null
        ? Date.parse(value)
        : new Date(Math.abs(numeric) < 1e12 ? numeric * 1000 : numeric).getTime();

    if (!value || Number.isNaN(timestamp)) throw new Error('invalidDate');

    const date = new Date(timestamp);
    return [
        \`ISO 8601: \${date.toISOString()}\`,
        \`Unix seconds: \${Math.floor(timestamp / 1000)}\`,
        \`Unix milliseconds: \${timestamp}\`,
        \`UTC: \${date.toUTCString()}\`,
        \`Local: \${date.toLocaleString()}\`,
    ].join('\n');
}
