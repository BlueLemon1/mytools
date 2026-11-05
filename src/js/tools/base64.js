/** Encodes a Unicode string as Base64 using UTF-8 bytes. */
export function encodeBase64(source) {
    const bytes = new TextEncoder().encode(source);
    const binaryString = Array.from(bytes, (byte) =>
        String.fromCharCode(byte),
    ).join('');

    return btoa(binaryString);
}

/** Decodes Base64 data as UTF-8 and rejects malformed UTF-8 sequences. */
export function decodeBase64(source) {
    const normalizedSource = source.replace(/\s/g, '');
    const binaryString = atob(normalizedSource);
    const bytes = Uint8Array.from(binaryString, (character) =>
        character.charCodeAt(0),
    );

    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}
