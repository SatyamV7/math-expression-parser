const evaluate = require("../src/index.js");

describe("Math Expression Parser", () => {
    test("Standard Calculations", () => {
        expect(evaluate("3 + 5 * 2")).toBe(13);
        expect(evaluate("10 + 2 * 6")).toBe(22);
        expect(evaluate("100 * 2 + 12")).toBe(212);
        expect(evaluate("100 * ( 2 + 12 )")).toBe(1400);
        expect(evaluate("100 * ( 2 + 12 ) / 14")).toBe(100);
        expect(evaluate("2 ** 3")).toBe(8);
        expect(evaluate("20 % 3")).toBe(2);
        expect(evaluate("2 ** 5")).toBe(32);
        expect(evaluate("5!")).toBe(120);
        expect(evaluate("2 + 4! * 2")).toBe(50);
        expect(evaluate("√(4) + 4")).toBe(6);
        expect(evaluate("√(4 + 4)")).toBe(2.8284271247461903);
    });

    test("Negative Number Support", () => {
        expect(evaluate("3 + -5 * 2")).toBe(-7);
        expect(evaluate("10 + -2 * 6")).toBe(-2);
        expect(evaluate("-100 * 2 + 12")).toBe(-188);
        expect(evaluate("100 * -2 + 12")).toBe(-188);
        expect(evaluate("100 * ( -2 + 12 )")).toBe(1000);
        expect(evaluate("100 * ( 2 + -12 )")).toBe(-1000);
        expect(evaluate("100 * ( -2 + -12 )")).toBe(-1400);
        expect(evaluate("100 * ( -2 + -12 ) / 14")).toBe(-100);
        expect(evaluate("-2 ** 3")).toBe(-8);
        expect(evaluate("-20 % 3")).toBe(-2);
        expect(evaluate("-2 ** 5")).toBe(-32);
        expect(evaluate("-5!")).toBe(-120);
        expect(evaluate("2 + -4! * 2")).toBe(-46);
        expect(evaluate("√(-4 + 4)")).toBe(0);
    });

    test("Floating-Point Decimal Support", () => {
        expect(evaluate("7.5 * 2 + 10")).toBe(25);
        expect(evaluate("9.9999999999999999 * ( 2 + 13 )")).toBe(150);
        expect(evaluate("1.5 ^ 2 * ( 2 * 7 ) / 14")).toBe(2.25);
    });

    test("Non-regular Symbols Support", () => {
        expect(evaluate("3 + 5 × 2")).toBe(13);
        expect(evaluate("10 ÷ 2 + 5")).toBe(10);
        expect(evaluate("4 ^ 4")).toBe(256);
    });

    test("Variables Support", () => {
        expect(evaluate("3 + a * 2", { a: 5 })).toBe(13);
        expect(evaluate("(b + 5) * 2", { b: 3 })).toBe(16);
        expect(evaluate("100 * ( 2c + c )", { c: 12 })).toBe(3600);
    });

    test("Constants Support", () => {
        expect(evaluate("PI * r ^ 2", { r: 7 })).toBe(153.93804002589985);
        expect(evaluate("PHI")).toBe(1.618033988749895);
        expect(evaluate("2PI")).toBe(6.283185307179586);
    });

    test('Error Handling', () => {
        expect(() => {
            evaluate('x + 2', { x: 'not a number' });
        }).toThrowError(new Error("Variable 'x' is not a number"));

        expect(() => {
            evaluate('2 +');
        }).toThrowError(new Error("Invalid expression: Insufficient operands"));

        expect(() => {
            evaluate('√-4');
        }).toThrowError(new Error("Invalid expression: Negative number under square root"));

        expect(() => {
            evaluate('2 / 0');
        }).toThrowError(new Error("Invalid expression: Division by zero"));

        expect(() => {
            evaluate('(2 + 3');
        }).toThrowError(new Error("Mismatched parentheses"));
    });
});
