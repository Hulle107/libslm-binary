import {binary} from '../src/index';

test(`CREATE number`, () => {
    const b = new binary(8, 218, false);
    expect(b.valueOf()).toBe(218);
});

test(`CREATE boolean`, () => {
    const b = new binary(8, true, false);
    expect(b.valueOf()).toBe(1);
});

test(`CREATE string`, () => {
    const b = new binary(8, '0b10101001', false);
    expect(b.valueOf()).toBe(169);
});

test(`CREATE boolean[]`, () => {
    const b = new binary(8, [true, true, false, true, true, false, true, false], false);
    expect(b.valueOf()).toBe(218);
});

test(`CREATE (1 | 0)[]`, () => {
    const b = new binary(8, [1, 1, 0, 1, 1, 0, 1, 0], false);
    expect(b.valueOf()).toBe(218);
});

test(`CREATE ('1' | '0')[]`, () => {
    const b = new binary(8, ['1', '1', '0', '1', '1', '0', '1', '0'], false);
    expect(b.valueOf()).toBe(218);
});

test('AND', () => {
    const a = new binary(8, 0xA9, false);
    const b = new binary(8, 0xDA, false);
    expect(a.and(b).valueOf()).toBe(136);
});

test('OR', () => {
    const a = new binary(8, 0xA9, false);
    const b = new binary(8, 0xDA, false);
    expect(a.or(b).valueOf()).toBe(251);
});

test('XOR', () => {
    const a = new binary(8, 0xA9, false);
    const b = new binary(8, 0xDA, false);
    expect(a.xor(b).valueOf()).toBe(115);
});

test('<<', () => {
    const a = new binary(8, 0xA9, false);
    expect(a.leftShift(2).valueOf()).toBe(164);
});

test('>>', () => {
    const a = new binary(8, 0xA9, false);
    expect(a.rightShift(2).valueOf()).toBe(42);
});

test('ADD', () => {
    const a = new binary(8, 0xA9, false);
    const b = new binary(8, 0xDA, false);
    expect(a.add(b).valueOf()).toBe(131);
});

test('SUBTRACT', () => {
    const a = new binary(8, 0xA9, false);
    const b = new binary(8, 0xDA, false);
    expect(a.subtract(b).valueOf()).toBe(207);
});

test(`BINARY`, () => {
    const b = new binary(8, 218, false);
    expect(b.toBinaryString(true)).toBe('0b11011010');
});

test(`HEXADECIMAL`, () => {
    const b = new binary(8, 218, false);
    expect(b.toHexadecimalString(true)).toBe('0xDA');
});

test(`ARRAY`, () => {
    const b = new binary(8, 218, false);
    expect(b.toArray()).toStrictEqual([true, true, false, true, true, false, true, false]);
});

test(`SIGNED`, () => {
    const b = new binary(8, 218, false);
    expect(b.signed).toBe(-37);
});

test(`UNSIGNED`, () => {
    const b = new binary(8, 218, false);
    expect(b.unsigned).toBe(218);
});

test(`PERFORMANCE(1_000_000) <= 1800ms`, () => {
    const array: ('1' | '0')[] = ['1', '0', '1', '0', '1', '0', '1', '0', '1', '0', '1', '0', '1', '0', '1', '0', '1', '0', '1', '0', '1', '0', '1', '0', '1', '0', '1', '0', '1', '0', '1', '0'];
    let start: number = performance.now();

    for (let i = 0; i < 1_000_000; i++) {
        let create: binary = new binary(32, array, true);
    }

    let end: number = performance.now();
    expect(end - start).toBeLessThanOrEqual(1800);
});