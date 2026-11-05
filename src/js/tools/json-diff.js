/** Compares two JSON values and reports changed paths. */
export function diffJson(leftSource, rightSource) {
    const left = JSON.parse(leftSource);
    const right = JSON.parse(rightSource);
    const changes = [];

    function compare(a, b, path = '$') {
        if (Object.is(a, b)) return;
        if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
            changes.push({ path, change: 'changed', before: a, after: b });
            return;
        }

        if (Array.isArray(a) !== Array.isArray(b)) {
            changes.push({ path, change: 'changed', before: a, after: b });
            return;
        }

        const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
        for (const key of keys) {
            const childPath = Array.isArray(a) ? `${path}[${key}]` : `${path}.${key}`;
            if (!Object.hasOwn(a, key)) {
                changes.push({ path: childPath, change: 'added', after: b[key] });
            } else if (!Object.hasOwn(b, key)) {
                changes.push({ path: childPath, change: 'removed', before: a[key] });
            } else {
                compare(a[key], b[key], childPath);
            }
        }
    }

    compare(left, right);
    return changes.length
        ? changes.map((item) => [
            `[${item.change.toUpperCase()}] ${item.path}`,
            item.before !== undefined ? `  - ${JSON.stringify(item.before)}` : '',
            item.after !== undefined ? `  + ${JSON.stringify(item.after)}` : '',
        ].filter(Boolean).join('\n')).join('\n\n')
        : 'No differences found.';
}
