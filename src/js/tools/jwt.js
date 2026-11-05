/** Decodes a JWT locally without validating its signature. */
export function decodeJwt(source) {
    const parts = source.trim().split('.');
    if (parts.length < 2) throw new Error('invalidJwt');

    function decodePart(part) {
        const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
        const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
        return JSON.parse(new TextDecoder().decode(bytes));
    }

    const header = decodePart(parts[0]);
    const payload = decodePart(parts[1]);
    const now = Math.floor(Date.now() / 1000);
    const lines = [
        'HEADER',
        JSON.stringify(header, null, 2),
        '',
        'PAYLOAD',
        JSON.stringify(payload, null, 2),
    ];

    if (typeof payload.exp === 'number') {
        lines.push('', `Expires: ${new Date(payload.exp * 1000).toLocaleString()}`);
        lines.push(payload.exp <= now ? 'Status: expired' : 'Status: not expired');
    }
    if (typeof payload.iat === 'number') {
        lines.push(`Issued: ${new Date(payload.iat * 1000).toLocaleString()}`);
    }

    lines.push('', 'Note: Decoding does not validate the token signature.');
    return lines.join('\n');
}
