/** Formats XML with indentation and rejects malformed documents. */
export function formatXml(source) {
    const documentNode = new DOMParser().parseFromString(source, 'application/xml');
    if (documentNode.querySelector('parsererror')) throw new Error('invalidXml');

    const serialized = new XMLSerializer().serializeToString(documentNode);
    const tokens = serialized.replace(/>\s*</g, '><').replace(/></g, '>\n<').split('\n');
    let depth = 0;
    return tokens.map((token) => {
        if (/^<\//.test(token)) depth = Math.max(0, depth - 1);
        const line = `${'  '.repeat(depth)}${token}`;
        if (/^<[^!?/][^>]*[^/]?>$/.test(token) && !/<\/[^>]+>$/.test(token)) depth += 1;
        return line;
    }).join('\n');
}

/** Removes inter-tag whitespace after validating the XML. */
export function minifyXml(source) {
    const documentNode = new DOMParser().parseFromString(source, 'application/xml');
    if (documentNode.querySelector('parsererror')) throw new Error('invalidXml');
    return new XMLSerializer().serializeToString(documentNode).replace(/>\s*</g, '><');
}
