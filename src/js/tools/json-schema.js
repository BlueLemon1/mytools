/**
 * Infers a compact JSON Schema from a sample value.
 * The omitTypes option deliberately removes every type keyword so null values
 * are accepted by Power Automate's Parse JSON action.
 */
export function generateJsonSchema(source, options = {}) {
    const sample = JSON.parse(source);
    const omitTypes = options.omitTypes === true;
    const allRequired = options.allRequired !== false;

    function infer(value, samples = [value]) {
        if (value === null) {
            return omitTypes ? {} : { type: 'null' };
        }

        if (Array.isArray(value)) {
            const itemSchemas = value.map((item) => infer(item));
            const items = mergeSchemas(itemSchemas);
            const schema = { items };

            if (!omitTypes) schema.type = 'array';
            return schema;
        }

        if (typeof value === 'object') {
            const properties = {};
            const keys = [...new Set(samples.flatMap((item) =>
                item && typeof item === 'object' && !Array.isArray(item)
                    ? Object.keys(item)
                    : [],
            ))];

            for (const key of keys) {
                const present = samples
                    .filter((item) => item && typeof item === 'object' && !Array.isArray(item) && Object.hasOwn(item, key))
                    .map((item) => item[key]);
                properties[key] = infer(present[0], present);
            }

            const schema = { properties };
            if (!omitTypes) schema.type = 'object';
            if (allRequired && keys.length) schema.required = keys;
            return schema;
        }

        const type = typeof value === 'number'
            ? (Number.isInteger(value) ? 'integer' : 'number')
            : typeof value;

        if (omitTypes) return {};
        return { type };
    }

    function mergeSchemas(schemas) {
        if (!schemas.length) return {};
        if (omitTypes) return schemas.length === 1 ? schemas[0] : {};

        const types = [...new Set(schemas.map((schema) => schema.type).filter(Boolean))];
        if (types.length > 1) return { anyOf: types.map((type) => ({ type })) };
        return schemas[0];
    }

    return JSON.stringify(infer(sample), null, 2);
}
