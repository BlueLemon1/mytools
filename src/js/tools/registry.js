import { calculate } from './calculator.js';
import {
    formatJson,
    minifyJson,
    validateJson,
} from './json.js';
import {
    transformText,
    getTextStats,
} from './text.js';
import {
    encodeBase64,
    decodeBase64,
} from './base64.js';

function createCalculatorTool() {
    return {
        id: 'calculator',
        category: 'utility',
        nameKey: 'calculator',
        descriptionKey: 'calculatorDesc',
        hintKey: 'calculatorHint',
        placeholderKey: 'calculatorPlaceholder',
        keywords: [
            'calculator',
            'rechner',
            'math',
            'mathematik',
            'rechnen',
            'percent',
            'prozent',
        ],
        actions: [
            {
                id: 'calculate',
                labelKey: 'calculate',
                primary: true,
                run: (value, language) => {
                    const locale = language === 'de' ? 'de-DE' : 'en-US';
                    const result = calculate(value);

                    return new Intl.NumberFormat(locale, {
                        maximumFractionDigits: 10,
                    }).format(result);
                },
            },
            {
                id: 'clear',
                labelKey: 'clear',
                run: () => '',
            },
        ],
    };
}

function createJsonTool() {
    return {
        id: 'json',
        category: 'dev',
        nameKey: 'json',
        descriptionKey: 'jsonDesc',
        hintKey: 'jsonHint',
        placeholderKey: 'jsonPlaceholder',
        keywords: [
            'json',
            'formatter',
            'format',
            'minify',
            'validate',
            'formatieren',
            'minifizieren',
            'validieren',
        ],
        actions: [
            {
                id: 'format',
                labelKey: 'format',
                primary: true,
                run: (value) => formatJson(value),
            },
            {
                id: 'minify',
                labelKey: 'minify',
                run: (value) => minifyJson(value),
            },
            {
                id: 'validate',
                labelKey: 'validate',
                run: (value, language, translate) => {
                    if (!validateJson(value)) {
                        throw new Error('invalidJson');
                    }

                    return translate('validJson');
                },
            },
        ],
    };
}

function createTextTool() {
    const operations = [
        { id: 'upper', labelKey: 'upper', primary: true },
        { id: 'lower', labelKey: 'lower' },
        { id: 'title', labelKey: 'titleCase' },
        { id: 'trim', labelKey: 'trim' },
        { id: 'dedupe', labelKey: 'dedupe' },
        { id: 'reverse', labelKey: 'reverse' },
    ];

    return {
        id: 'text',
        category: 'text',
        nameKey: 'text',
        descriptionKey: 'textDesc',
        hintKey: 'textHint',
        placeholderKey: 'textPlaceholder',
        keywords: [
            'text',
            'uppercase',
            'lowercase',
            'title case',
            'trim',
            'words',
            'zeichen',
            'wörter',
            'zeilen',
        ],
        actions: [
            ...operations.map((operation) => ({
                ...operation,
                run: (value, language) => transformText(
                    value,
                    operation.id,
                    language === 'de' ? 'de-DE' : 'en',
                ),
            })),
            {
                id: 'stats',
                labelKey: 'stats',
                run: (value, language, translate) => {
                    const stats = getTextStats(value);
                    const rows = [
                        [translate('chars'), stats.chars],
                        [translate('charsNoSpaces'), stats.charsNoSpaces],
                        [translate('words'), stats.words],
                        [translate('lines'), stats.lines],
                    ];

                    return rows
                        .map(([label, count]) => `${label}: ${count}`)
                        .join('\n');
                },
            },
        ],
    };
}

function createBase64Tool() {
    return {
        id: 'base64',
        category: 'dev',
        nameKey: 'base64',
        descriptionKey: 'base64Desc',
        hintKey: 'base64Hint',
        placeholderKey: 'base64Placeholder',
        keywords: [
            'base64',
            'encode',
            'decode',
            'encoder',
            'decoder',
            'codieren',
            'decodieren',
            'utf-8',
        ],
        actions: [
            {
                id: 'encode',
                labelKey: 'encode',
                primary: true,
                run: (value) => encodeBase64(value),
            },
            {
                id: 'decode',
                labelKey: 'decode',
                run: (value) => decodeBase64(value),
            },
        ],
    };
}

/** The central registry used to render, search, and open available tools. */
export const tools = [
    createCalculatorTool(),
    createJsonTool(),
    createTextTool(),
    createBase64Tool(),
];

export function getTool(id) {
    return tools.find((tool) => tool.id === id);
}
