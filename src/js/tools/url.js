/** Parses a URL and lists its components and query parameters. */
export function parseUrl(source) {
    let url;
    try {
        url = new URL(source.trim());
    } catch {
        throw new Error('invalidUrl');
    }

    const lines = [
        `Protocol: ${url.protocol}`,
        `Host: ${url.host}`,
        `Hostname: ${url.hostname}`,
        `Port: ${url.port || '(default)'}`,
        `Path: ${url.pathname}`,
        `Fragment: ${url.hash || '(none)'}`,
        '',
        'Query parameters:',
    ];

    for (const [key, value] of url.searchParams) {
        lines.push(`  ${key} = ${value}`);
    }
    if (!url.searchParams.size) lines.push('  (none)');
    return lines.join('\n');
}
