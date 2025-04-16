

/**
 * Represents a **binary** *number* with *bit*-level operations and configurable *signedness*.
 * @note Supports arithmetic, logical, and comparison operations on fixed-size **binary**.
 */
export class binary {
    /**
     * The *number* of *bits* in **this** binary instance.
     */
    readonly length: number;
    
    /**
     * A *bitmask* with all *bits* set to 1 for **this** binary's length.
     */
    readonly mask: number;

    /**
     * Used internally for *signed number* calculations.
     */
    protected readonly decimalMask: number;

    /**
     * Used internally to determine *sign* in *signed mode*.
     */
    protected readonly signedMask: number;

    /**
     * Determines if **this** binary number is treated as *signed*.
     */
    useSigned: boolean = false;

    /**
     * Access each *bit* by index (0 is MSB, `length - 1` is LSB).
     */
    [key: number]: boolean;

    /**
     * Returns the numerical value of **this** binary instance (*signed* or *unsigned*).
     */
    get value(): number { return this.useSigned? this.signed : this.unsigned }

    /**
     * Returns an *unsigned integer* representation of **this** binary instance.
     */
    get unsigned(): number {
        let number: number = 0;
    
        for (
            let index: number = this.length - 1, mask: number = 1;
            index >= 0;
            number += this[index]? mask : 0, mask <<= 1, index--
        );
    
        return number;
    }

    /**
     * Returns a *signed integer* representation of **this** binary instance.
     */
    get signed(): number {
        let number: number = this.unsigned;

        if (number & this.signedMask) number = -this.signedMask + (number & this.decimalMask);

        return number;
    }

    /**
     * Returns a *copy* of **this** binary instance.
     */
    get copy(): binary { return new binary(this.length, this) }

    /**
     * Creates a **new** binary instance with a specified *bit* size and optional initial value.
     * 
     * @param size - The *number* of *bits*.
     * @param value - Initial value in various forms (*number*, *string*, *boolean*, **array**, or **binary**).
     * @param useSigned - Whether to interpret this value as *signed*.
     */
    constructor(size: number, value?: binary, useSigned?: boolean);
    constructor(size: number, value?: number, useSigned?: boolean);
    constructor(size: number, value?: boolean, useSigned?: boolean);
    constructor(size: number, value?: string, useSigned?: boolean);
    constructor(size: number, value?: boolean[], useSigned?: boolean);
    constructor(size: number, value?: (1 | 0)[], useSigned?: boolean);
    constructor(size: number, value?: ('1' | '0')[], useSigned?: boolean);
    constructor(size: number) {
        let argument: unknown = arguments[1];

        if (argument === null) throw new Error(`${this[Symbol.toStringTag]}: given value can't be null.`);
        if (argument === undefined) throw new Error(`${this[Symbol.toStringTag]}: given value can't be undefined.`);
        if (typeof arguments[2] === 'boolean') this.useSigned = arguments[2];

        this.length = size;
        this.mask = +('0b' + '1'.repeat(size));
        this.decimalMask = this.mask >> 1;
        this.signedMask = this.mask & this.decimalMask;

        for ( let index: number = this.length - 1; index >= 0; index-- ) {
            this[index] = false;
        }

        const value = this.convert(argument);

        this.reform(value);
    }

    protected reform(value: number): this {
        if (!this.useSigned) {
            for ( let index: number = this.length - 1, mask: number = 1; index >= 0; mask <<= 1, index-- ) {
                this[index] = value & mask? true : false;
            }
        } else {
            for ( let index: number = this.length - 1, mask: number = 1; index >= 0; mask <<= 1, index-- ) {
                this[index] = value & mask & this.decimalMask? true : false;
            }
            if (value < 0) this[0] = true;
        }

        return this;
    }

    protected convert(data: unknown): number {
        if (data === null) throw new Error(`binary.convert: Does not support, convertion of value null, to a binary.`);
        if (data === undefined) throw new Error(`binary.convert: Does not support, convertion of value undefined, to a binary.`);
    
        if (data instanceof binary) return data.valueOf();
        if (typeof data === 'number') return data;
        if (typeof data === 'boolean') return data? 1 : 0;
        if (typeof data === 'string') {
            if (data.length === 0) throw new Error(`binary.convert: Does not support, convertion of empty string, to a binary.`);
            if (isNaN(+data)) throw new Error(`binary.convert: Does not support, convertion of non-numeric string, to a binary.`);
    
            return +data;
        }
        if (Array.isArray(data)) {
            if (data.length === 0) throw new Error(`binary.convert: Does not support, convertion of empty array, to a binary.`);
            let found: boolean = false;
            let value: number = 0;
    
            if (data.every((value) => typeof value === 'boolean')) {
                found = true;
                for ( 
                    let index: number = data.length - 1, mask: number = 1;
                    index >= 0;
                    value += (data[index]? 1 : 0) & mask, mask <<= 1, index--
                );
            }
    
            if (data.every((value) => typeof value === 'number')) {
                found = true;
                for ( 
                    let index: number = data.length - 1, mask: number = 1;
                    index >= 0;
                    value += data[index] & mask, mask <<= 1, index--
                );
            }
    
            if (data.every((value) => typeof value === 'string' && !isNaN(+value))) {
                found = true;
                for ( 
                    let index: number = data.length - 1, mask: number = 1;
                    index >= 0;
                    value += data[index] & mask, mask <<= 1, index--
                );
            }
    
            if (!found) throw new Error(`binary.convert: Does not support, convertion of array content, to a binary.`);
            return value;
        }
    
        throw new Error(`binary.convert: Does not support, convertion of '${data}', to a binary.`);
    }

    // ****************************************
    // *       Static Bitwise Operations      *
    // ****************************************

    static and<T extends binary>(target: T, value: binary): T;
    static and<T extends binary>(target: T, value: number): T;
    static and<T extends binary>(target: T, value: boolean): T;
    static and<T extends binary>(target: T, value: string): T;
    static and<T extends binary>(target: T, value: boolean[]): T;
    static and<T extends binary>(target: T, value: (1 | 0)[]): T;
    static and<T extends binary>(target: T, value: ('1' | '0')): T;
    static and<T extends binary>(): T {
        if (!(arguments[0] instanceof binary)) throw new Error(`binary.add: The target must be an instance of binary.`);

        const target = arguments[0] as T;
        const value = new binary(target.length, arguments[1], target.useSigned);
        let number = target.valueOf() & value.valueOf();

        target.reform(number);
        return target;
    }

    static or<T extends binary>(target: T, value: binary): T;
    static or<T extends binary>(target: T, value: number): T;
    static or<T extends binary>(target: T, value: boolean): T;
    static or<T extends binary>(target: T, value: string): T;
    static or<T extends binary>(target: T, value: boolean[]): T;
    static or<T extends binary>(target: T, value: (1 | 0)[]): T;
    static or<T extends binary>(target: T, value: ('1' | '0')[]): T;
    static or<T extends binary>(): T {
        if (!(arguments[0] instanceof binary)) throw new Error(`binary.add: The target must be an instance of binary.`);

        const target = arguments[0] as T;
        const value = new binary(target.length, arguments[1], target.useSigned);
        let number = target.valueOf() | value.valueOf();

        target.reform(number);
        return target;
    }

    static xor<T extends binary>(target: T, value: binary): T;
    static xor<T extends binary>(target: T, value: number): T;
    static xor<T extends binary>(target: T, value: boolean): T;
    static xor<T extends binary>(target: T, value: string): T;
    static xor<T extends binary>(target: T, value: boolean[]): T;
    static xor<T extends binary>(target: T, value: (1 | 0)[]): T;
    static xor<T extends binary>(target: T, value: ('1' | '0')[]): T;
    static xor<T extends binary>(): T {
        if (!(arguments[0] instanceof binary)) throw new Error(`binary.add: The target must be an instance of binary.`);

        const target = arguments[0] as T;
        const value = new binary(target.length, arguments[1], target.useSigned);
        let number = target.valueOf() ^ value.valueOf();

        target.reform(number);
        return target;
    }

    static not<T extends binary>(target: T): T {
        if (!(target instanceof binary)) throw new Error(`binary.add: The target must be an instance of binary.`);

        target.reform(~target.valueOf());
        return target;
    }

    static leftShift<T extends binary>(target: T, value: binary): T;
    static leftShift<T extends binary>(target: T, value: number): T;
    static leftShift<T extends binary>(target: T, value: boolean): T;
    static leftShift<T extends binary>(target: T, value: string): T;
    static leftShift<T extends binary>(target: T, value: boolean[]): T;
    static leftShift<T extends binary>(target: T, value: (1 | 0)[]): T;
    static leftShift<T extends binary>(target: T, value: ('1' | '0')[]): T;
    static leftShift<T extends binary>(): T {
        if (!(arguments[0] instanceof binary)) throw new Error(`binary.add: The target must be an instance of binary.`);

        const target = arguments[0] as T;
        const value = new binary(target.length, arguments[1], target.useSigned);
        let number = target.valueOf() << value.valueOf();

        target.reform(number);
        return target;
    }

    static rightShift<T extends binary>(target: T, value: binary): T;
    static rightShift<T extends binary>(target: T, value: number): T;
    static rightShift<T extends binary>(target: T, value: boolean): T;
    static rightShift<T extends binary>(target: T, value: string): T;
    static rightShift<T extends binary>(target: T, value: boolean[]): T;
    static rightShift<T extends binary>(target: T, value: (1 | 0)[]): T;
    static rightShift<T extends binary>(target: T, value: ('1' | '0')[]): T;
    static rightShift<T extends binary>(): T {
        if (!(arguments[0] instanceof binary)) throw new Error(`binary.add: The target must be an instance of binary.`);

        const target = arguments[0] as T;
        const value = new binary(target.length, arguments[1], target.useSigned);
        let number = target.valueOf() >> value.valueOf();

        target.reform(number);
        return target;
    }

    // ****************************************
    // *         Bitwise Operations           *
    // ****************************************

    /**
     * Bitwise AND performed on **this** binary instance with given value.
     * @param value Value given in various forms (*number*, *string*, *boolean*, **array**, or **binary**).
     */
    and(value: binary): this;
    and(value: number): this;
    and(value: boolean): this;
    and(value: string): this;
    and(value: boolean[]): this;
    and(value: (1 | 0)[]): this;
    and(value: ('1' | '0')[]): this;
    and(): this { return binary.and(this, arguments[0]) }

    /**
     * Bitwise OR performed on **this** binary instance with given value.
     * @param value Given value in various forms (*number*, *string*, *boolean*, **array**, or **binary**).
     */
    or(value: binary): this;
    or(value: number): this;
    or(value: boolean): this;
    or(value: string): this;
    or(value: boolean[]): this;
    or(value: (1 | 0)[]): this;
    or(value: ('1' | '0')[]): this;
    or(): this { return binary.or(this, arguments[0]) }

    /**
     * Bitwise XOR performed on **this** binary instance with given value.
     * @param value Given value in various forms (*number*, *string*, *boolean*, **array**, or **binary**).
     */
    xor(value: binary): this;
    xor(value: number): this;
    xor(value: boolean): this;
    xor(value: string): this;
    xor(value: boolean[]): this;
    xor(value: (1 | 0)[]): this;
    xor(value: ('1' | '0')[]): this;
    xor(): this { return binary.xor(this, arguments[0]) }

    /**
     * Bitwise NOT performed on **this** binary instance.
     */
    not(): this { return binary.not(this) }

    /**
     * Bitwise left shift performed on **this** binary instance by the given *number* of steps.
     * @param steps Given *number* of steps in various forms (*number*, *string*, *boolean*, **array**, or **binary**).
     */
    leftShift(value: binary): this;
    leftShift(value: number): this;
    leftShift(value: boolean): this;
    leftShift(value: string): this;
    leftShift(value: boolean[]): this;
    leftShift(value: (1 | 0)[]): this;
    leftShift(value: ('1' | '0')[]): this;
    leftShift(): this { return binary.leftShift(this, arguments[0]) }

    /**
     * Bitwise right shift performed on **this** binary instance by the given *number* of steps.
     * @param steps Given *number* of steps in various forms (*number*, *string*, *boolean*, **array**, or **binary**).
     */
    rightShift(value: binary): this;
    rightShift(value: number): this;
    rightShift(value: boolean): this;
    rightShift(value: string): this;
    rightShift(value: boolean[]): this;
    rightShift(value: (1 | 0)[]): this;
    rightShift(value: ('1' | '0')[]): this;
    rightShift(): this { return binary.rightShift(this, arguments[0]) }

    // ****************************************
    // *     Static Arithmetic Operations     *
    // ****************************************

    static add<T extends binary>(target: T, value: binary): T;
    static add<T extends binary>(target: T, value: number): T;
    static add<T extends binary>(target: T, value: boolean): T;
    static add<T extends binary>(target: T, value: string): T;
    static add<T extends binary>(target: T, value: boolean[]): T;
    static add<T extends binary>(target: T, value: (1 | 0)[]): T;
    static add<T extends binary>(target: T, value: ('1' | '0')[]): T;
    static add<T extends binary>(): T {
        if (!(arguments[0] instanceof binary)) throw new Error(`binary.add: The target must be an instance of binary.`);

        const target = arguments[0] as T;
        const value = new binary(target.length, arguments[1], target.useSigned);
        let number = target.valueOf() + value.valueOf();

        target.reform(number);
        return target;
    }

    static subtract<T extends binary>(target: T, value: binary): T;
    static subtract<T extends binary>(target: T, value: number): T;
    static subtract<T extends binary>(target: T, value: boolean): T;
    static subtract<T extends binary>(target: T, value: string): T;
    static subtract<T extends binary>(target: T, value: boolean[]): T;
    static subtract<T extends binary>(target: T, value: (1 | 0)[]): T;
    static subtract<T extends binary>(target: T, value: ('1' | '0')[]): T;
    static subtract<T extends binary>(): T {
        if (!(arguments[0] instanceof binary)) throw new Error(`binary.add: The target must be an instance of binary.`);

        const target = arguments[0] as T;
        const value = new binary(target.length, arguments[1], target.useSigned);
        let number = target.valueOf() - value.valueOf();

        target.reform(number);
        return target;
    }

    // ****************************************
    // *        Arithmetic Operations         *
    // ****************************************

    /**
     * Adds given value to **this** binary instance.
     * @param value Given value in various forms (*number*, *string*, *boolean*, **array**, or **binary**).
     * @note Handles both *unsigned* and *signed* values based on **this** *useSigned* flag.
     */
    add(value: binary): this;
    add(value: number): this;
    add(value: boolean): this;
    add(value: string): this;
    add(value: boolean[]): this;
    add(value: (1 | 0)[]): this;
    add(value: ('1' | '0')[]): this;
    add(): this { return binary.add(this, arguments[0]) }

    /**
     * Subtracts given value to **this** binary instance.
     * @param value Given value in various forms (*number*, *string*, *boolean*, **array**, or **binary**).
     * @note Handles both *unsigned* and *signed* values based on **this** *useSigned* flag.
     */
    subtract(value: binary): this;
    subtract(value: number): this;
    subtract(value: boolean): this;
    subtract(value: string): this;
    subtract(value: boolean[]): this;
    subtract(value: (1 | 0)[]): this;
    subtract(value: ('1' | '0')[]): this;
    subtract(): this { return binary.subtract(this, arguments[0]) }

    // ****************************************
    // *     Static Comparison Operations     *
    // ****************************************

    static equal<T extends binary>(target: T, value: binary): boolean;
    static equal<T extends binary>(target: T, value: number): boolean;
    static equal<T extends binary>(target: T, value: boolean): boolean;
    static equal<T extends binary>(target: T, value: string): boolean;
    static equal<T extends binary>(target: T, value: boolean[]): boolean;
    static equal<T extends binary>(target: T, value: (1 | 0)[]): boolean;
    static equal<T extends binary>(target: T, value: ('1' | '0')[]): boolean;
    static equal<T extends binary>(): boolean {
        if (!(arguments[0] instanceof binary)) throw new Error(`binary.add: The target must be an instance of binary.`);

        const target = arguments[0] as T;
        const value = new binary(target.length, arguments[1], target.useSigned);

        return target.valueOf() === value.valueOf();
    }

    static notEqual<T extends binary>(target: T, value: binary): boolean;
    static notEqual<T extends binary>(target: T, value: number): boolean;
    static notEqual<T extends binary>(target: T, value: boolean): boolean;
    static notEqual<T extends binary>(target: T, value: string): boolean;
    static notEqual<T extends binary>(target: T, value: boolean[]): boolean;
    static notEqual<T extends binary>(target: T, value: (1 | 0)[]): boolean;
    static notEqual<T extends binary>(target: T, value: ('1' | '0')[]): boolean;
    static notEqual<T extends binary>(): boolean {
        if (!(arguments[0] instanceof binary)) throw new Error(`binary.add: The target must be an instance of binary.`);

        const target = arguments[0] as T;
        const value = new binary(target.length, arguments[1], target.useSigned);

        return target.valueOf() !== value.valueOf();
    }

    static greaterThen<T extends binary>(target: T, value: binary): boolean;
    static greaterThen<T extends binary>(target: T, value: number): boolean;
    static greaterThen<T extends binary>(target: T, value: boolean): boolean;
    static greaterThen<T extends binary>(target: T, value: string): boolean;
    static greaterThen<T extends binary>(target: T, value: boolean[]): boolean;
    static greaterThen<T extends binary>(target: T, value: (1 | 0)[]): boolean;
    static greaterThen<T extends binary>(target: T, value: ('1' | '0')[]): boolean;
    static greaterThen<T extends binary>(): boolean {
        if (!(arguments[0] instanceof binary)) throw new Error(`binary.add: The target must be an instance of binary.`);

        const target = arguments[0] as T;
        const value = new binary(target.length, arguments[1], target.useSigned);

        return target.valueOf() > value.valueOf();
    }

    static lessThen<T extends binary>(target: T, value: binary): boolean;
    static lessThen<T extends binary>(target: T, value: number): boolean;
    static lessThen<T extends binary>(target: T, value: boolean): boolean;
    static lessThen<T extends binary>(target: T, value: string): boolean;
    static lessThen<T extends binary>(target: T, value: boolean[]): boolean;
    static lessThen<T extends binary>(target: T, value: (1 | 0)[]): boolean;
    static lessThen<T extends binary>(target: T, value: ('1' | '0')[]): boolean;
    static lessThen<T extends binary>(): boolean {
        if (!(arguments[0] instanceof binary)) throw new Error(`binary.add: The target must be an instance of binary.`);

        const target = arguments[0] as T;
        const value = new binary(target.length, arguments[1], target.useSigned);

        return target.valueOf() < value.valueOf();
    }

    static greaterThenOrEqual<T extends binary>(target: T, value: binary): boolean;
    static greaterThenOrEqual<T extends binary>(target: T, value: number): boolean;
    static greaterThenOrEqual<T extends binary>(target: T, value: boolean): boolean;
    static greaterThenOrEqual<T extends binary>(target: T, value: string): boolean;
    static greaterThenOrEqual<T extends binary>(target: T, value: boolean[]): boolean;
    static greaterThenOrEqual<T extends binary>(target: T, value: (1 | 0)[]): boolean;
    static greaterThenOrEqual<T extends binary>(target: T, value: ('1' | '0')[]): boolean;
    static greaterThenOrEqual<T extends binary>(): boolean {
        if (!(arguments[0] instanceof binary)) throw new Error(`binary.add: The target must be an instance of binary.`);

        const target = arguments[0] as T;
        const value = new binary(target.length, arguments[1], target.useSigned);

        return target.valueOf() >= value.valueOf();
    }

    static lessThenOrEqual<T extends binary>(target: T, value: binary): boolean;
    static lessThenOrEqual<T extends binary>(target: T, value: number): boolean;
    static lessThenOrEqual<T extends binary>(target: T, value: boolean): boolean;
    static lessThenOrEqual<T extends binary>(target: T, value: string): boolean;
    static lessThenOrEqual<T extends binary>(target: T, value: boolean[]): boolean;
    static lessThenOrEqual<T extends binary>(target: T, value: (1 | 0)[]): boolean;
    static lessThenOrEqual<T extends binary>(target: T, value: ('1' | '0')[]): boolean;
    static lessThenOrEqual<T extends binary>(): boolean {
        if (!(arguments[0] instanceof binary)) throw new Error(`binary.add: The target must be an instance of binary.`);

        const target = arguments[0] as T;
        const value = new binary(target.length, arguments[1], target.useSigned);

        return target.valueOf() <= value.valueOf();
    }

    // ****************************************
    // *        Comparison Operations         *
    // ****************************************

    /**
     * Checks if the given value is equal to **this** binary instance.
     * @param value Given value in various forms (*number*, *string*, *boolean*, **array**, or **binary**).
     */
    equal(value: binary): boolean;
    equal(value: number): boolean;
    equal(value: boolean): boolean;
    equal(value: string): boolean;
    equal(value: boolean[]): boolean;
    equal(value: (1 | 0)[]): boolean;
    equal(value: ('1' | '0')[]): boolean;
    equal(): boolean { return binary.equal(this, arguments[0]) }

    /**
     * Checks if the given value is not equal to **this** binary instance.
     * @param value Given value in various forms (*number*, *string*, *boolean*, **array**, or **binary**).
     */
    notEqual(value: binary): boolean;
    notEqual(value: number): boolean;
    notEqual(value: boolean): boolean;
    notEqual(value: string): boolean;
    notEqual(value: boolean[]): boolean;
    notEqual(value: (1 | 0)[]): boolean;
    notEqual(value: ('1' | '0')[]): boolean;
    notEqual(): boolean { return binary.notEqual(this, arguments[0]) }

    /**
     * Checks if the given value is greater then **this** binary instance.
     * @param value Given value in various forms (*number*, *string*, *boolean*, **array**, or **binary**).
     */
    greaterThen(value: binary): boolean;
    greaterThen(value: number): boolean;
    greaterThen(value: boolean): boolean;
    greaterThen(value: string): boolean;
    greaterThen(value: boolean[]): boolean;
    greaterThen(value: (1 | 0)[]): boolean;
    greaterThen(value: ('1' | '0')[]): boolean;
    greaterThen(): boolean { return binary.greaterThen(this, arguments[0]) }

    /**
     * Checks if the given value is less then **this** binary instance.
     * @param value Given value in various forms (*number*, *string*, *boolean*, **array**, or **binary**).
     */
    lessThen(value: binary): boolean;
    lessThen(value: number): boolean;
    lessThen(value: boolean): boolean;
    lessThen(value: string): boolean;
    lessThen(value: boolean[]): boolean;
    lessThen(value: (1 | 0)[]): boolean;
    lessThen(value: ('1' | '0')[]): boolean;
    lessThen(): boolean { return binary.lessThen(this, arguments[0]) }

    /**
     * Checks if the given value is greater then or equal to **this** binary instance.
     * @param value Given value in various forms (*number*, *string*, *boolean*, **array**, or **binary**).
     */
    greaterThenOrEqual(value: binary): boolean;
    greaterThenOrEqual(value: number): boolean;
    greaterThenOrEqual(value: boolean): boolean;
    greaterThenOrEqual(value: string): boolean;
    greaterThenOrEqual(value: boolean[]): boolean;
    greaterThenOrEqual(value: (1 | 0)[]): boolean;
    greaterThenOrEqual(value: ('1' | '0')[]): boolean;
    greaterThenOrEqual(): boolean { return binary.greaterThenOrEqual(this, arguments[0]) }

    /**
     * Checks if the given value is less then or equal to **this** binary instance.
     * @param value Given value in various forms (*number*, *string*, *boolean*, **array**, or **binary**).
     */
    lessThenOrEqual(value: binary): boolean;
    lessThenOrEqual(value: number): boolean;
    lessThenOrEqual(value: boolean): boolean;
    lessThenOrEqual(value: string): boolean;
    lessThenOrEqual(value: boolean[]): boolean;
    lessThenOrEqual(value: (1 | 0)[]): boolean;
    lessThenOrEqual(value: ('1' | '0')[]): boolean;
    lessThenOrEqual(): boolean { return binary.lessThenOrEqual(this, arguments[0]) }

    // ****************************************
    // *    Conversion From Various Inputs    *
    // ****************************************

    /**
     * Copies *bit values* from another **binary** instance into **this** binary instance.
     * @note Truncates **binary** if it's longer then **this**.
     * @note Pads with 0 if the **binary** is shorter then **this**.
     */
    fromBinary(binary: binary): this {
        const value = this.convert(binary);
        this.reform(value);
        
        return this;
    }

    /**
     * Converts an **array** of *booleans*, *numbers*, or *bit strings* into **this** binary instance.
     * @note Truncates **array** if it's longer then **this**.
     * @note Pads with 0 if the **array** is shorter than **this**.
     */
    fromArray(array: boolean[]): this;
    fromArray(array: (1 | 0)[]): this;
    fromArray(array: ('1' | '0')[]): this;
    fromArray(): this {
        const array = arguments[0];
        const value = this.convert(array);
        this.reform(value);

        return this;
    }

    /**
     * Converts a single *boolean* into **this** binary instance.
     * @note Only the last bit is used; all others are set to 0.
     */
    fromBoolean(boolean: boolean): this {
        const value = this.convert(boolean);
        this.reform(value);

        return this;
    }

    /**
     * Converts a *number* into **this** binary instance.
     * @note Handles both *unsigned* and *signed* values based on **this** *useSigned* flag.
     */
    fromNumber(number: number): this {
        const value = this.convert(number);
        this.reform(value);

        return this;
    }

    /**
     * Converts a *numeric string* into **this** binary instance.
     * @note Handles both *unsigned* and *signed* values based on **this** *useSigned* flag.
     */
    fromString(string: string): this {
        const value = this.convert(string);
        this.reform(value);

        return this;
    }

    // ****************************************
    // *     Conversion to Output Formats     *
    // ****************************************

    /**
     * Converts **this** binary instance to a *number* **array**.
     */
    toArray(): boolean[] {
        let array: boolean[] = [];

        for ( let index: number = 0; index < this.length; index++) {
            array.push(this[index]);
        }

        return array;
    }

    /**
     * Converts **this** binary instance to a *binary string*.
     * @param prefix Whether to include *0b* prefix on the output.
     */
    toBinaryString(prefix: boolean = false): string {
        let string: string = prefix? '0b' : '';
    
        for ( let index = 0; index < this.length; index++) {
            string += this[index]? '1' : '0';
        }
    
        return string;
    }

    /**
     * Converts **this** binary instance to a *hexadecimal string*.
     * @param prefix Whether to include *0x* prefix on the output.
     */
    toHexadecimalString(prefix: boolean = false): string {
        const stringified: string = this.toBinaryString(false);
        const length: number = Math.ceil(stringified.length / 4);
        let string: string = prefix? '0x' : '';
    
        for (let char: number = 0; char < length; char++) {
            let number: number = 0;
            let start: number = char * 4;
            let end: number = start + 4;
    
            if (end < stringified.length)
                for (
                    let index: number = start;
                    index < end;
                    number += stringified[index] == '1'? 1 : 0, index++
                );
    
            switch (number) {
                case 10: string += 'A'; break;
                case 11: string += 'B'; break;
                case 12: string += 'C'; break;
                case 13: string += 'D'; break;
                case 14: string += 'E'; break;
                case 15: string += 'F'; break;
                default: string += number; break;
            }
        }
    
        return string;
    }

    /**
     * Used for automatic conversion to primitive *number*.
     */
    valueOf(): number { return this.useSigned? this.signed : this.unsigned }

    /**
     * Used for automatic conversion to primitive *string*.
     */
    toString(): string { return `${this.valueOf()}` }

    /**
     * Indicates this object should be flattened when concatenated (e.g. in arrays).
     */
    readonly [Symbol.isConcatSpreadable]: boolean = true;

    /**
     * Custom string tag for object inspection.
     */
    readonly [Symbol.toStringTag]: string = 'binary';
    
    /**
     * Custom primitive conversion handler.
     */
    [Symbol.toPrimitive](hint: 'string' | 'number' | 'default') {
        if (hint === 'number') return this.valueOf();
        if (hint === 'string') return this.toString();
        return null;
    }

    /**
     * Iterable interface: yields *bits* from LSB to MSB.
     */
    *[Symbol.iterator]() {
        for ( let index = this.length - 1; index >= 0; index++ ) {
            yield this[index];
            if (index === 0) return;
        }
    }
}

/**
 * Represents a **bit** with *bit*-level operations and configurable *signedness*.
 * @note Supports arithmetic, logical, and comparison operations on fixed-size of 1.
 */
export class bit extends binary {
    /**
     * Creates a **new** binary instance with a 1-*bit* size and optional initial value.
     * 
     * @param size - The *number* of *bits*.
     * @param value - Initial value in various forms (*number*, *string*, *boolean*, **array**, or **binary**).
     * @param useSigned - Whether to interpret this value as *signed*.
     */
    constructor(value?: binary, useSigned?: boolean);
    constructor(value?: number, useSigned?: boolean);
    constructor(value?: boolean, useSigned?: boolean);
    constructor(value?: string, useSigned?: boolean);
    constructor(value?: boolean[], useSigned?: boolean);
    constructor(value?: (1 | 0)[], useSigned?: boolean);
    constructor(value?: ('1' | '0')[], useSigned?: boolean);
    constructor() {
        super(1, arguments[0], arguments[1]);
    }

    /**
     * Returns a *copy* of **this** binary instance.
     */
    get copy(): bit { return new bit(this) }

    /**
     * Returns a **new** binary instance with a value of 0.
     */
    static get zero(): bit { return new bit(0) }

    /**
     * Custom string tag for object inspection.
     */
    readonly [Symbol.toStringTag]: string = 'bit';
}

/**
 * Represents a **nibble** with *bit*-level operations and configurable *signedness*.
 * @note Supports arithmetic, logical, and comparison operations on fixed-size of 4.
 */
export class nibble extends binary {
    /**
     * Creates a **new** binary instance with a 4-*bit* size and optional initial value.
     * 
     * @param size - The *number* of *bits*.
     * @param value - Initial value in various forms (*number*, *string*, *boolean*, **array**, or **binary**).
     * @param useSigned - Whether to interpret this value as *signed*.
     */
    constructor(value?: binary, useSigned?: boolean);
    constructor(value?: number, useSigned?: boolean);
    constructor(value?: boolean, useSigned?: boolean);
    constructor(value?: string, useSigned?: boolean);
    constructor(value?: boolean[], useSigned?: boolean);
    constructor(value?: (1 | 0)[], useSigned?: boolean);
    constructor(value?: ('1' | '0')[], useSigned?: boolean);
    constructor() {
        super(4, arguments[0], arguments[1]);
    }

    /**
     * Returns a *copy* of **this** binary instance.
     */
    get copy(): nibble { return new nibble(this) }

    /**
     * Returns a **new** binary instance with a value of 0.
     */
    static get zero(): nibble { return new nibble(0) }

    /**
     * Custom string tag for object inspection.
     */
    readonly [Symbol.toStringTag]: string = 'nibble';
}

/**
 * Represents a **byte** with *bit*-level operations and configurable *signedness*.
 * @note Supports arithmetic, logical, and comparison operations on fixed-size of 8.
 */
export class byte extends binary {
    /**
     * Creates a **new** binary instance with a 8-*bit* size and optional initial value.
     * 
     * @param size - The *number* of *bits*.
     * @param value - Initial value in various forms (*number*, *string*, *boolean*, **array**, or **binary**).
     * @param useSigned - Whether to interpret this value as *signed*.
     */
    constructor(value?: binary, useSigned?: boolean);
    constructor(value?: number, useSigned?: boolean);
    constructor(value?: boolean, useSigned?: boolean);
    constructor(value?: string, useSigned?: boolean);
    constructor(value?: boolean[], useSigned?: boolean);
    constructor(value?: (1 | 0)[], useSigned?: boolean);
    constructor(value?: ('1' | '0')[], useSigned?: boolean);
    constructor() {
        super(8, arguments[0], arguments[1]);
    }

    /**
     * Returns a *copy* of **this** binary instance.
     */
    get copy(): byte { return new byte(this) }

    /**
     * Returns a **new** binary instance with a value of 0.
     */
    static get zero(): byte { return new byte(0) }

    /**
     * Custom string tag for object inspection.
     */
    readonly [Symbol.toStringTag]: string = 'byte';
}

/**
 * Represents a **word** with *bit*-level operations and configurable *signedness*.
 * @note Supports arithmetic, logical, and comparison operations on fixed-size of 16.
 */
export class word extends binary {
    /**
     * Creates a **new** binary instance with a 16-*bit* size and optional initial value.
     * 
     * @param size - The *number* of *bits*.
     * @param value - Initial value in various forms (*number*, *string*, *boolean*, **array**, or **binary**).
     * @param useSigned - Whether to interpret this value as *signed*.
     */
    constructor(value?: binary, useSigned?: boolean);
    constructor(value?: number, useSigned?: boolean);
    constructor(value?: boolean, useSigned?: boolean);
    constructor(value?: string, useSigned?: boolean);
    constructor(value?: boolean[], useSigned?: boolean);
    constructor(value?: (1 | 0)[], useSigned?: boolean);
    constructor(value?: ('1' | '0')[], useSigned?: boolean);
    constructor() {
        super(16, arguments[0], arguments[1]);
    }

    /**
     * Returns a *copy* of **this** binary instance.
     */
    get copy(): word { return new word(this) }

    /**
     * Returns a **new** binary instance with a value of 0.
     */
    static get zero(): word { return new word(0) }

    /**
     * Custom string tag for object inspection.
     */
    readonly [Symbol.toStringTag]: string = 'word';
}

/**
 * Represents a **dword** with *bit*-level operations and configurable *signedness*.
 * @note Supports arithmetic, logical, and comparison operations on fixed-size of 32.
 */
export class dword extends binary {
    /**
     * Creates a **new** binary instance with a 32-*bit* size and optional initial value.
     * 
     * @param size - The *number* of *bits*.
     * @param value - Initial value in various forms (*number*, *string*, *boolean*, **array**, or **binary**).
     * @param useSigned - Whether to interpret this value as *signed*.
     */
    constructor(value?: binary, useSigned?: boolean);
    constructor(value?: number, useSigned?: boolean);
    constructor(value?: boolean, useSigned?: boolean);
    constructor(value?: string, useSigned?: boolean);
    constructor(value?: boolean[], useSigned?: boolean);
    constructor(value?: (1 | 0)[], useSigned?: boolean);
    constructor(value?: ('1' | '0')[], useSigned?: boolean);
    constructor() {
        super(32, arguments[0], arguments[1]);
    }

    /**
     * Returns a *copy* of **this** binary instance.
     */
    get copy(): dword { return new dword(this) }

    /**
     * Returns a **new** binary instance with a value of 0.
     */
    static get zero(): dword { return new dword(0) }

    /**
     * Custom string tag for object inspection.
     */
    readonly [Symbol.toStringTag]: string = 'dword';
}