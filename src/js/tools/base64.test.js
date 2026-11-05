import { describe, expect, it } from 'vitest';
import { decodeBase64, encodeBase64 } from './base64.js';

describe('Base64 UTF-8 tools', () => {
    it('round-trips Unicode text', () => {
        const value = 'Grüße 世界 🌍';

        expect(decodeBase64(encodeBase64(value))).toBe(value);
    });

    it('ignores whitespace when decoding', () => {
        expect(decodeBase64('SGVs\nbG8=')).toBe('Hello');
    });

    it('rejects invalid UTF-8 data', () => {
        expect(() => decodeBase64('////')).toThrow();
    });
});
