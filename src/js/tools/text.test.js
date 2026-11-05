import { describe, expect, it } from 'vitest';
import { getTextStats, transformText } from './text.js';

describe('text tools', () => {
    it('transforms text', () => {
        expect(transformText('hello', 'upper')).toBe('HELLO');
        expect(transformText(' a \n b ', 'trim')).toBe('a\nb');
        expect(transformText('a\nb\na', 'dedupe')).toBe('a\nb');
    });

    it('counts Unicode characters', () => {
        expect(getTextStats('Grüße 🌍')).toEqual({
            chars: 7,
            charsNoSpaces: 6,
            words: 2,
            lines: 1,
        });
    });

    it('handles empty text statistics', () => {
        expect(getTextStats('')).toEqual({
            chars: 0,
            charsNoSpaces: 0,
            words: 0,
            lines: 0,
        });
    });
});
