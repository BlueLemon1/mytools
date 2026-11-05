import { describe, expect, it } from 'vitest';
import {
    formatJson,
    minifyJson,
    validateJson,
} from './json.js';

describe('JSON tools', () => {
    const sample = '{ "name": "Alex", "active": true }';

    it('formats JSON with indentation', () => {
        expect(formatJson(sample)).toContain('\n  "name"');
    });

    it('minifies JSON', () => {
        expect(minifyJson(sample)).toBe('{"name":"Alex","active":true}');
    });

    it('validates JSON', () => {
        expect(validateJson(sample)).toBe(true);
        expect(validateJson('{bad')).toBe(false);
    });

    it('throws when formatting invalid JSON', () => {
        expect(() => formatJson('{bad')).toThrow();
    });
});
