function evaluate(expression, variables = {}) { // Evaluate mathematical expression with variables and constants using Shunting Yard Algorithm
    // Define constants
    const CONSTANTS = {
        PI: Math.PI,
        PHI: (1 + Math.sqrt(5)) / 2,
    };

    // Replace non-standard symbols with standard symbols
    expression = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**');

    // Replace variables with their values
    for (let variable in variables) {
        let value = variables[variable];
        if (typeof value !== 'number') {
            throw new Error(`Variable '${variable}' is not a number`);
        }
        let regex = new RegExp(`\\b${variable}\\b`, 'g');
        expression = expression.replace(regex, value);
    }

    // Replace constants with their values (case insensitive)
    for (let constant in CONSTANTS) {
        let value = CONSTANTS[constant];
        let regex = new RegExp(`\\b${constant}\\b`, 'gi');
        expression = expression.replace(regex, value);
    }

    // Add multiplication operator between a number and a variable or constant if they are adjacent and there's no operator between them
    expression = expression.replace(/(\d)(?=[a-zA-Z])/g, '$1*');

    // Regular expression to match numbers (including negative and floating-point), operators, parentheses, and variables including '**', '!', and '√'
    var tokens = expression.match(/-?\d*\.?\d+|\*\*|√|[+\-*/%!()]|[a-zA-Z]+/g);

    if (!tokens) {
        throw new Error("Invalid expression: Unable to tokenize");
    }

    var result = [];
    var operators = [];

    var precedence = {
        '!': 5,
        '**': 4,
        '√': 4,
        '*': 3,
        '/': 3,
        '%': 3,
        '+': 2,
        '-': 2
    };

    var associativity = {
        '!': 'Right',
        '**': 'Right',
        '√': 'Right',
        '*': 'Left',
        '/': 'Left',
        '%': 'Left',
        '+': 'Left',
        '-': 'Left'
    };

    // Function to calculate factorial
    function factorial(n) {
        let isNegative = false;
        if (n < 0) {
            isNegative = true;
            n = -n;
        }
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return isNegative ? -result : result;
    }

    // Function to apply operators
    function applyOperator(operator) {
        if (operator === '!') {
            if (result.length < 1) {
                throw new Error("Invalid expression: Insufficient operands for factorial");
            }
            var a = parseFloat(result.pop());
            result.push(factorial(a));
        } else if (operator === '√') {
            if (result.length < 1) {
                throw new Error("Invalid expression: Insufficient operands for square root");
            }
            var a = parseFloat(result.pop());
            if (a < 0) {
                throw new Error("Invalid expression: Negative number under square root");
            }
            result.push(Math.sqrt(a));
        } else {
            if (result.length < 2) {
                throw new Error("Invalid expression: Insufficient operands");
            }
            var b = parseFloat(result.pop());
            var a = parseFloat(result.pop());
            switch (operator) {
                case '+':
                    result.push(a + b);
                    break;
                case '-':
                    result.push(a - b);
                    break;
                case '*':
                    result.push(a * b);
                    break;
                case '/':
                    if (b === 0) {
                        throw new Error("Invalid expression: Division by zero");
                    }
                    result.push(a / b);
                    break;
                case '%':
                    result.push(a % b);
                    break;
                case '**':
                    result.push(a ** b);
                    break;
                default:
                    throw new Error(`Unknown operator: ${operator}`);
            }
        }
    }

    // Helper function to check if token is a number
    function isNumber(token) {
        return !isNaN(token) && !isNaN(parseFloat(token));
    }

    tokens.forEach(function (token, index) {
        if (isNumber(token)) {
            result.push(token); // Push numbers to the result
        } else if (token in precedence) {
            while (operators.length > 0) {
                var topOperator = operators[operators.length - 1];
                if ((associativity[token] === 'Left' && precedence[token] <= precedence[topOperator]) ||
                    (associativity[token] === 'Right' && precedence[token] < precedence[topOperator])) {
                    applyOperator(operators.pop());
                } else {
                    break;
                }
            }
            operators.push(token); // Push operators to the stack
        } else if (token === '(') {
            operators.push(token); // Push opening parentheses to the stack
        } else if (token === ')') {
            while (operators.length > 0 && operators[operators.length - 1] !== '(') {
                applyOperator(operators.pop());
            }
            if (operators.length > 0) {
                operators.pop(); // Discard the '('
            } else {
                throw new Error("Mismatched parentheses");
            }
        } else if (token in CONSTANTS) { // Add this case to handle constants
            result.push(CONSTANTS[token]);
        } else if (/^[a-zA-Z]+$/.test(token)) { // Add this case to handle variables
            if (!(token in variables)) {
                throw new Error(`Undefined variable: ${token}`);
            }
            result.push(variables[token]);
        } else {
            throw new Error(`Invalid token: ${token}`);
        }
    });

    // Apply remaining operators
    while (operators.length > 0) {
        if (operators[operators.length - 1] === '(') {
            throw new Error("Mismatched parentheses");
        }
        applyOperator(operators.pop());
    }

    if (result.length !== 1) {
        throw new Error(`Invalid expression: Result stack has unexpected length. Stack length: ${result.length}`);
    }

    return parseFloat(result[0]); // Result
}

// UMD Export for Node.js and Browser
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // ES6 Modules
        module.exports.default = factory();
    } else {
        // Browser globals (root is window)
        root.evaluate = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    return evaluate;
}));