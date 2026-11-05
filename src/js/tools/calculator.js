/**
 * Tokenizes a mathematical expression.
 * Supported operators: +, -, *, /, %, ^, ** and parentheses.
 */
function tokenize(source) {
    const expression = String(source).replace(/\s+/g, '').replace(',', '.');

    if (!expression) {
        throw new Error('empty');
    }

    const tokenPattern = /\d+(?:\.\d+)?|\*\*|[()+\-*/%^]/gy;
    const tokens = [];
    let position = 0;

    while (position < expression.length) {
        tokenPattern.lastIndex = position;

        const match = tokenPattern.exec(expression);

        if (!match) {
            throw new Error('syntax');
        }

        tokens.push(match[0]);
        position = tokenPattern.lastIndex;
    }

    return tokens;
}

/**
 * Evaluates a mathematical expression without using eval or Function.
 * The parser implements operator precedence and right-associative powers.
 */
export function calculate(source) {
    const tokens = tokenize(source);
    let position = 0;

    const peek = () => tokens[position];
    const consume = () => tokens[position++];

    function parsePrimary() {
        if (peek() === '+' || peek() === '-') {
            const sign = consume();
            const value = parsePrimary();

            return sign === '-' ? -value : value;
        }

        if (peek() === '(') {
            consume();

            const value = parseExpression();

            if (consume() !== ')') {
                throw new Error('syntax');
            }

            return value;
        }

        const token = consume();

        if (token === undefined || !/^\d+(?:\.\d+)?$/.test(token)) {
            throw new Error('syntax');
        }

        return Number(token);
    }

    function parsePower() {
        const base = parsePrimary();

        if (peek() === '**' || peek() === '^') {
            consume();
            return Math.pow(base, parseUnary());
        }

        return base;
    }

    function parseUnary() {
        let value = parsePower();

        while (peek() === '%') {
            consume();
            value /= 100;
        }

        return value;
    }

    function parseTerm() {
        let value = parseUnary();

        while (['*', '/', '%'].includes(peek())) {
            const operator = consume();
            const rightOperand = parseUnary();

            if (
                (operator === '/' || operator === '%') &&
                rightOperand === 0
            ) {
                throw new Error('zero');
            }

            switch (operator) {
                case '*':
                    value *= rightOperand;
                    break;
                case '/':
                    value /= rightOperand;
                    break;
                case '%':
                    value %= rightOperand;
                    break;
                default:
                    throw new Error('syntax');
            }
        }

        return value;
    }

    function parseExpression() {
        let value = parseTerm();

        while (peek() === '+' || peek() === '-') {
            const operator = consume();
            const rightOperand = parseTerm();

            value = operator === '+'
                ? value + rightOperand
                : value - rightOperand;
        }

        return value;
    }

    const result = parseExpression();

    if (position !== tokens.length || !Number.isFinite(result)) {
        throw new Error('syntax');
    }

    return result;
}
