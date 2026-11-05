import { describe, expect, it } from 'vitest';
import { convertDateTime } from './datetime.js';
import { buildPowerAutomateExpression } from './power-automate.js';
import { generatePowerShellSnippet } from './powershell-snippets.js';
import { generateJsonSchema } from './json-schema.js';

describe('developer helper tools', () => {
    it('converts Unix seconds to ISO and milliseconds', () => {
        const result = convertDateTime('1730000000');
        expect(result).toContain('ISO 8601: 2024-10-27T03:33:20.000Z');
        expect(result).toContain('Unix milliseconds: 1730000000000');
    });

    it('builds Power Automate expressions without an editor prefix', () => {
        expect(buildPowerAutomateExpression('coalesce', "body('Get_item')?['Title'], 'n/a'"))
            .toBe("coalesce(body('Get_item')?['Title'], 'n/a')");
        expect(buildPowerAutomateExpression('utcNow')).toBe('utcNow()');
        expect(buildPowerAutomateExpression('custom', "triggerBody()?['dataareaid']"))
            .toBe("triggerBody()?['dataareaid']");
    });

    it('requires arguments for functions that need them', () => {
        expect(() => buildPowerAutomateExpression('coalesce')).toThrow('expressionArgumentsRequired');
    });

    it('generates a PowerShell 5.1 REST template with supplied values', () => {
        const result = generatePowerShellSnippet('rest', {
            uri: 'https://example.org/api',
            tokenVariable: '$token',
        });
        expect(result).toContain("-Uri 'https://example.org/api'");
        expect(result).toContain("'Bearer ' + $token");
    });

    it('omits JSON Schema types when requested so null values are accepted', () => {
        const schema = JSON.parse(generateJsonSchema(
            '{"name":"Max","active":null}',
            { omitTypes: true },
        ));
        expect(schema.properties.active).toEqual({});
        expect(schema).not.toHaveProperty('type');
        expect(schema.properties.name).not.toHaveProperty('type');
    });
});
