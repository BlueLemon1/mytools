import { describe, expect, it } from 'vitest';
import { filterTools } from './search.js';

const sampleTools = [
    {
        id: 'json',
        nameKey: 'JSON Formatter',
        descriptionKey: 'format data',
        category: 'dev',
        keywords: ['minify', 'validieren'],
    },
    {
        id: 'text',
        nameKey: 'Text Converter',
        descriptionKey: 'transform text',
        category: 'text',
        keywords: ['uppercase'],
    },
];

describe('filterTools', () => {
    it('matches names and keywords without case sensitivity', () => {
        expect(filterTools(sampleTools, 'VALIDIEREN').map((tool) => tool.id))
            .toEqual(['json']);

        expect(filterTools(sampleTools, 'text').map((tool) => tool.id))
            .toEqual(['text']);
    });

    it('filters tools by category', () => {
        expect(filterTools(sampleTools, '', 'dev').map((tool) => tool.id))
            .toEqual(['json']);
    });

    it('filters tools by favorites', () => {
        expect(filterTools(sampleTools, '', 'favorites', ['text']).map((tool) => tool.id))
            .toEqual(['text']);
    });

    it('returns no results for a query that does not match', () => {
        expect(filterTools(sampleTools, 'unknown')).toEqual([]);
    });
});
