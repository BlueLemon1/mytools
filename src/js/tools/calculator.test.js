import { describe, expect, it } from 'vitest';
import { calculate } from './calculator.js';

describe('calculate', () => {
    it('respects operator precedence and parentheses', () => {
        expect(calculate('(125 + 39) * 2')).toBe(328);
        expect(calculate('2 + 3 * 4')).toBe(14);
    });

    it('supports decimals, powers, and percentages', () => {
        expect(calculate('1,5 * 2')).toBe(3);
        expect(calculate('2^3')).toBe(8);
        expect(calculate('200 * 19%')).toBe(38);
    });

    it('evaluates chained powers from right to left', () => {
        expect(calculate('2^3^2')).toBe(512);
    });

    it('rejects invalid expressions and division by zero', () => {
        expect(() => calculate('')).toThrow();
        expect(() => calculate('1 / 0')).toThrow();
        expect(() => calculate('alert(1)')).toThrow();
        expect(() => calculate('2 +')).toThrow();
    });
});
