const EXPRESSIONS = {
    coalesce: (args) => \`coalesce(\${args})\`,
    if: (args) => \`if(\${args})\`,
    equals: (args) => \`equals(\${args})\`,
    contains: (args) => \`contains(\${args})\`,
    startsWith: (args) => \`startsWith(\${args})\`,
    endsWith: (args) => \`endsWith(\${args})\`,
    length: (args) => \`length(\${args})\`,
    first: (args) => \`first(\${args})\`,
    last: (args) => \`last(\${args})\`,
    join: (args) => \`join(\${args})\`,
    concat: (args) => \`concat(\${args})\`,
    formatDateTime: (args) => \`formatDateTime(\${args})\`,
    convertTimeZone: (args) => \`convertTimeZone(\${args})\`,
    addDays: (args) => \`addDays(\${args})\`,
    addHours: (args) => \`addHours(\${args})\`,
    utcNow: () => 'utcNow()',
    int: (args) => \`int(\${args})\`,
    string: (args) => \`string(\${args})\`,
    json: (args) => \`json(\${args})\`,
    uriComponent: (args) => \`uriComponent(\${args})\`,
    body: (args) => \`body('\${args}')\`,
    outputs: (args) => \`outputs('\${args}')\`,
    triggerBody: () => 'triggerBody()',
    item: () => 'item()',
    items: (args) => \`items('\${args}')\`,
    variables: (args) => \`variables('\${args}')\`,
    parameters: (args) => \`parameters('\${args}')\`,
};

export function buildPowerAutomateExpression(name, args = '') {
    const builder = EXPRESSIONS[name];
    if (!builder) throw new Error('unknownExpression');
    if (name !== 'utcNow' && name !== 'triggerBody' && name !== 'item' && !args.trim()) {
        throw new Error('expressionArgumentsRequired');
    }
    return '@' + builder(args.trim());
}

export const powerAutomateExpressions = Object.keys(EXPRESSIONS);
