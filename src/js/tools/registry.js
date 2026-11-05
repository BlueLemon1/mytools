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


import { generateJsonSchema } from './json-schema.js';
import { diffJson } from './json-diff.js';
import { decodeJwt } from './jwt.js';
import { testRegex } from './regex.js';
import { convertDateTime } from './datetime.js';
import { parseUrl } from './url.js';
import { formatXml, minifyXml } from './xml.js';
import { buildPowerAutomateExpression } from './power-automate.js';
import { generatePowerShellSnippet } from './powershell-snippets.js';

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


function createJsonSchemaTool() {
    return {
        id: 'json-schema', category: 'dev', nameKey: 'jsonSchema',
        descriptionKey: 'jsonSchemaDesc', hintKey: 'jsonSchemaHint',
        placeholderKey: 'jsonSchemaPlaceholder',
        keywords: ['power automate', 'parse json', 'schema', 'json schema', 'null', 'typ'],
        actions: [{
            id: 'generate', labelKey: 'generate', primary: true,
            run: (value, language, translate, options) => generateJsonSchema(value, options),
        }],
    };
}

function createJsonDiffTool() {
    return {
        id: 'json-diff', category: 'dev', nameKey: 'jsonDiff',
        descriptionKey: 'jsonDiffDesc', hintKey: 'jsonDiffHint',
        placeholderKey: 'jsonDiffPlaceholder',
        keywords: ['compare', 'diff', 'vergleich', 'unterschiede'],
        actions: [{
            id: 'compare', labelKey: 'compare', primary: true,
            run: (value, language, translate, options) => diffJson(value, options.compareInput),
        }],
    };
}

function createRegexTool() {
    return {
        id: 'regex', category: 'dev', nameKey: 'regex',
        descriptionKey: 'regexDesc', hintKey: 'regexHint',
        placeholderKey: 'regexPlaceholder',
        keywords: ['regular expression', 'regex', 'regulärer ausdruck', 'pattern'],
        actions: [{
            id: 'test', labelKey: 'test', primary: true,
            run: (value, language, translate, options) => testRegex(value, options.pattern, options.flags),
        }],
    };
}

function createJwtTool() {
    return {
        id: 'jwt', category: 'dev', nameKey: 'jwt',
        descriptionKey: 'jwtDesc', hintKey: 'jwtHint',
        placeholderKey: 'jwtPlaceholder',
        keywords: ['token', 'bearer', 'claims', 'decode', 'entra', 'oauth'],
        actions: [{
            id: 'decode', labelKey: 'decode', primary: true,
            run: (value) => decodeJwt(value),
        }],
    };
}

function createXmlTool() {
    return {
        id: 'xml', category: 'dev', nameKey: 'xml',
        descriptionKey: 'xmlDesc', hintKey: 'xmlHint',
        placeholderKey: 'xmlPlaceholder',
        keywords: ['xml', 'format', 'validate', 'minify', 'schnittstelle'],
        actions: [
            { id: 'format', labelKey: 'format', primary: true, run: (value) => formatXml(value) },
            { id: 'minify', labelKey: 'minify', run: (value) => minifyXml(value) },
        ],
    };
}

function createUrlTool() {
    return {
        id: 'url', category: 'dev', nameKey: 'url',
        descriptionKey: 'urlDesc', hintKey: 'urlHint',
        placeholderKey: 'urlPlaceholder',
        keywords: ['url', 'uri', 'query string', 'parameter', 'sharepoint link'],
        actions: [{ id: 'parse', labelKey: 'parse', primary: true, run: (value) => parseUrl(value) }],
    };
}

function createDateTimeTool() {
    return {
        id: 'datetime', category: 'utility', nameKey: 'datetime',
        descriptionKey: 'datetimeDesc', hintKey: 'datetimeHint',
        placeholderKey: 'datetimePlaceholder',
        keywords: ['date', 'time', 'unix', 'timestamp', 'utc', 'iso 8601', 'datum', 'zeit'],
        actions: [{ id: 'convert', labelKey: 'convert', primary: true, run: (value) => convertDateTime(value) }],
    };
}


function createPowerAutomateTool() {
    return {
        id: 'power-automate', category: 'dev', nameKey: 'powerAutomate',
        descriptionKey: 'powerAutomateDesc', hintKey: 'powerAutomateHint',
        placeholderKey: 'powerAutomatePlaceholder',
        keywords: ['power automate', 'expression', 'workflow', 'flow', 'coalesce', 'triggerbody', 'body', 'outputs'],
        actions: [{
            id: 'build', labelKey: 'buildExpression', primary: true,
            run: (value, language, translate, options) => buildPowerAutomateExpression(
                options.expressionName,
                options.expressionArguments || value,
            ),
        }],
    };
}

function createPowerShellTool() {
    return {
        id: 'powershell', category: 'dev', nameKey: 'powershell',
        descriptionKey: 'powershellDesc', hintKey: 'powershellHint',
        placeholderKey: 'powershellPlaceholder',
        keywords: ['powershell', 'powershell 5.1', 'active directory', 'exchange online', 'microsoft graph', 'rest api', 'csv', 'json'],
        actions: [{
            id: 'generate', labelKey: 'generateCode', primary: true,
            run: (value, language, translate, options) => generatePowerShellSnippet(
                options.powershellSnippet,
                { uri: options.powershellUri, tokenVariable: options.powershellToken },
            ),
        }],
    };
}

/** The central registry used to render, search, and open available tools. */
export const tools = [
    createCalculatorTool(),
    createJsonTool(),
    createTextTool(),
    createBase64Tool(),
    createJsonSchemaTool(),
    createJsonDiffTool(),
    createRegexTool(),
    createJwtTool(),
    createXmlTool(),
    createUrlTool(),
    createDateTimeTool(),
    createPowerAutomateTool(),
    createPowerShellTool(),
];

export function getTool(id) {
    return tools.find((tool) => tool.id === id);
}
