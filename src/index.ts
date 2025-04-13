export interface NullError extends Error {}
export interface UndefinedError extends Error {}
export interface EmptyError extends Error {}
export interface NaNError extends Error {}

interface NullErrorConstructor extends TypeErrorConstructor {
    new (message?: string): NullError;
    (message?: string): NullError;
    readonly prototype: NullError;
}

interface UndefinedErrorConstructor extends TypeErrorConstructor {
    new (message?: string): UndefinedError;
    (message?: string): UndefinedError;
    readonly prototype: UndefinedError;
}

interface EmptyErrorConstructor extends RangeErrorConstructor {
    new (message?: string): EmptyError;
    (message?: string): EmptyError;
    readonly prototype: EmptyError;
}

interface NaNErrorConstructor extends TypeErrorConstructor {
    new (message?: string): NaNError;
    (message?: string): NaNError;
    readonly prototype: NaNError;
}

export declare var NullError: NullErrorConstructor;
export declare var UndefinedError: UndefinedErrorConstructor;
export declare var EmptyError: EmptyErrorConstructor;
export declare var NaNError: NaNErrorConstructor;

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
    get value(): number { return this.useSigned? this.signed() : this.unsigned() }

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

        if (argument === null) throw new NullError(`${this[Symbol.toStringTag]}: given value can't be null.`);
        if (argument === undefined) throw new UndefinedError(`${this[Symbol.toStringTag]}: given value can't be undefined.`);
        if (typeof arguments[2] === 'boolean') this.useSigned = arguments[2];

        this.length = size;
        this.mask = +('0b' + '1'.repeat(size));
        this.decimalMask = this.mask >> 1;
        this.signedMask = this.mask & this.decimalMask;

        for ( let index: number = this.length - 1; index >= 0; index-- ) {
            this[index] = false;
        }

        if (Array.isArray(argument)) this.fromArray(argument);
        if (argument instanceof binary) this.fromBinary(argument);
        if (typeof argument === 'number') this.fromNumber(argument);
        if (typeof argument === 'boolean') this.fromBoolean(argument);
        if (typeof argument === 'string') this.fromString(argument);
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
    and(): this {
        const value = arguments[0];

        if (value === null) throw new NullError(`${this[Symbol.toStringTag]}: given value can't be null.`);
        if (value === undefined) throw new UndefinedError(`${this[Symbol.toStringTag]}: given value can't be undefined.`);

        let number = this.unsigned();

        if (value instanceof binary) number &= value.unsigned();
        if (typeof value === 'number') number &= value;
        if (typeof value === 'boolean') number &= value? 1 : 0;
        if (typeof value === 'string') {
            if (value.length === 0) throw new EmptyError(`${this[Symbol.toStringTag]}: value can't be an empty string.`);
            if (isNaN(+value)) throw new NaNError(`${this[Symbol.toStringTag]}: the value of '${value}' is not a numeric string.`);

            number &= +value;
        }
        if (Array.isArray(value)) {
            let other = new binary(value.length, value);
            number &= other.unsigned();
        }

        this.fromNumber(number);
        return this;
    }

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
    or(): this {
        const value = arguments[0];

        if (value === null) throw new NullError(`${this[Symbol.toStringTag]}: given value can't be null.`);
        if (value === undefined) throw new UndefinedError(`${this[Symbol.toStringTag]}: given value can't be undefined.`);

        let number = this.unsigned();

        if (value instanceof binary) number |= value.unsigned();
        if (typeof value === 'number') number |= value;
        if (typeof value === 'boolean') number |= value? 1 : 0;
        if (typeof value === 'string') {
            if (value.length === 0) throw new EmptyError(`${this[Symbol.toStringTag]}: value can't be an empty string.`);
            if (isNaN(+value)) throw new NaNError(`${this[Symbol.toStringTag]}: the value of '${value}' is not a numeric string.`);

            number |= +value;
        }
        if (Array.isArray(value)) {
            let other = new binary(value.length, value);
            number |= other.unsigned();
        }

        this.fromNumber(number);
        return this;
    }

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
    xor(): this {
        const value = arguments[0];

        if (value === null) throw new NullError(`${this[Symbol.toStringTag]}: given value can't be null.`);
        if (value === undefined) throw new UndefinedError(`${this[Symbol.toStringTag]}: given value can't be undefined.`);

        let number = this.unsigned();

        if (value instanceof binary) number ^= value.unsigned();
        if (typeof value === 'number') number ^= value;
        if (typeof value === 'boolean') number ^= value? 1 : 0;
        if (typeof value === 'string') {
            if (value.length === 0) throw new EmptyError(`${this[Symbol.toStringTag]}: value can't be an empty string.`);
            if (isNaN(+value)) throw new NaNError(`${this[Symbol.toStringTag]}: the value of '${value}' is not a numeric string.`);

            number ^= +value;
        }
        if (Array.isArray(value)) {
            let other = new binary(value.length, value);
            number ^= other.unsigned();
        }

        this.fromNumber(number);
        return this;
    }

    /**
     * Bitwise NOT performed on **this** binary instance.
     */
    not(): this {
        let value = this.unsigned();
        value = ~value;
        this.fromNumber(value);
        return this;
    }

    /**
     * Bitwise left shift performed on **this** binary instance by the given *number* of steps.
     * @param steps Given *number* of steps in various forms (*number*, *string*, *boolean*).
     */
    leftShift(steps: number): this;
    leftShift(steps: boolean): this;
    leftShift(steps: string): this;
    leftShift(): this {
        const steps = arguments[0];
        let value = this.unsigned();

        if (steps === null) throw new NullError(`${this[Symbol.toStringTag]}: given steps can't be null.`);
        if (steps === undefined) throw new UndefinedError(`${this[Symbol.toStringTag]}: given steps can't be undefined.`);
        if (typeof steps === 'number') value <<= steps;
        if (typeof steps === 'boolean') value <<= steps? 1 : 0;
        if (typeof steps === 'string') {
            if (steps.length === 0) throw new EmptyError(`${this[Symbol.toStringTag]}: given steps can't be an empty string.`);
            if (isNaN(+steps)) throw new NaNError(`${this[Symbol.toStringTag]}: given steps of '${steps}' is not a numeric string.`);

            value <<= +steps;
        }

        this.fromNumber(value);
        return this;
    }

    /**
     * Bitwise right shift performed on **this** binary instance by the given *number* of steps.
     * @param steps Given *number* of steps in various forms (*number*, *string*, *boolean*).
     */
    rightShift(steps: number): this;
    rightShift(steps: boolean): this;
    rightShift(steps: string): this;
    rightShift(): this {
        const steps = arguments[0];
        let value = this.unsigned();

        if (steps === null) throw new NullError(`${this[Symbol.toStringTag]}: given steps can't be null.`);
        if (steps === undefined) throw new UndefinedError(`${this[Symbol.toStringTag]}: given steps can't be undefined.`);
        if (typeof steps === 'number') value >>= steps;
        if (typeof steps === 'boolean') value >>= steps? 1 : 0;
        if (typeof steps === 'string') {
            if (steps.length === 0) throw new EmptyError(`${this[Symbol.toStringTag]}: given steps can't be an empty string.`);
            if (isNaN(+steps)) throw new NaNError(`${this[Symbol.toStringTag]}: given steps of '${steps}' is not a numeric string.`);

            value >>= +steps;
        }

        this.fromNumber(value);
        return this;
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
    add(): this {
        const value = arguments[0];

        if (value === null) throw new NullError(`${this[Symbol.toStringTag]}: given value can't be null.`);
        if (value === undefined) throw new UndefinedError(`${this[Symbol.toStringTag]}: given value can't be undefined.`);

        let number = this.useSigned? this.signed() : this.unsigned();

        if (value instanceof binary) number += value.useSigned ? value.signed() : value.unsigned();
        if (typeof value === 'number') number += value;
        if (typeof value === 'boolean') number += value? 1 : 0;
        if (typeof value === 'string') {
            if (value.length === 0) throw new EmptyError(`${this[Symbol.toStringTag]}: given value can't be an empty string.`);
            if (isNaN(+value)) throw new NaNError(`${this[Symbol.toStringTag]}: given value of '${value}' is not a numeric string.`);

            number += +value;
        }
        if (Array.isArray(value)) {
            let other = new binary(value.length, value);
            number += other.unsigned();
        }

        this.fromNumber(number);
        return this;
    }

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
    subtract(): this {
        const value = arguments[0];

        if (value === null) throw new NullError(`${this[Symbol.toStringTag]}: given value can't be null.`);
        if (value === undefined) throw new UndefinedError(`${this[Symbol.toStringTag]}: given value can't be undefined.`);

        let number = this.useSigned? this.signed() : this.unsigned();

        if (value instanceof binary) number -= value.useSigned ? value.signed() : value.unsigned();
        if (typeof value === 'number') number -= value;
        if (typeof value === 'boolean') number -= value? 1 : 0;
        if (typeof value === 'string') {
            if (value.length === 0) throw new EmptyError(`${this[Symbol.toStringTag]}: given value can't be an empty string.`);
            if (isNaN(+value)) throw new NaNError(`${this[Symbol.toStringTag]}: given value of '${value}' is not a numeric string.`);

            number -= +value;
        }
        if (Array.isArray(value)) {
            let other = new binary(value.length, value);
            number -= other.unsigned();
        }

        this.fromNumber(number);
        return this;
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
    equal(): boolean {
        const value = arguments[0];

        if (value instanceof binary && this.unsigned() === value.unsigned()) return true;
        if (typeof value === 'number' && this.valueOf() === value) return true; 
        if (typeof value === 'boolean' && this.valueOf() === (value? 1 : 0)) return true; 
        if (typeof value === 'string' && this.toString() === value) return true;
        if (Array.isArray(value)) {
            let other = new binary(value.length, value);
            if (this.unsigned() === other.unsigned()) return true;
        }

        return false;
    }

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
    notEqual(): boolean {
        const value = arguments[0];

        if (value instanceof binary && this.unsigned() !== value.unsigned()) return true;
        if (typeof value === 'number' && this.valueOf() !== value) return true; 
        if (typeof value === 'boolean' && this.valueOf() !== (value? 1 : 0)) return true; 
        if (typeof value === 'string' && this.toString() !== value) return true;
        if (Array.isArray(value)) {
            let other = new binary(value.length, value);
            if (this.unsigned() !== other.unsigned()) return true;
        }

        return false;
    }

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
    greaterThen(): boolean {
        const value = arguments[0];

        if (value instanceof binary && this.unsigned() > value.unsigned()) return true;
        if (typeof value === 'number' && this.valueOf() > value) return true; 
        if (typeof value === 'boolean' && this.valueOf() > (value? 1 : 0)) return true; 
        if (typeof value === 'string' && this.toString() > value) return true;
        if (Array.isArray(value)) {
            let other = new binary(value.length, value);
            if (this.unsigned() > other.unsigned()) return true;
        }

        return false;
    }

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
    lessThen(): boolean {
        const value = arguments[0];

        if (value instanceof binary && this.unsigned() < value.unsigned()) return true;
        if (typeof value === 'number' && this.valueOf() < value) return true; 
        if (typeof value === 'boolean' && this.valueOf() < (value? 1 : 0)) return true; 
        if (typeof value === 'string' && this.toString() < value) return true;
        if (Array.isArray(value)) {
            let other = new binary(value.length, value);
            if (this.unsigned() < other.unsigned()) return true;
        }

        return false;
    }

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
    greaterThenOrEqual(): boolean {
        const value = arguments[0];

        if (value instanceof binary && this.unsigned() >= value.unsigned()) return true;
        if (typeof value === 'number' && this.valueOf() >= value) return true; 
        if (typeof value === 'boolean' && this.valueOf() >= (value? 1 : 0)) return true; 
        if (typeof value === 'string' && this.toString() >= value) return true;
        if (Array.isArray(value)) {
            let other = new binary(value.length, value);
            if (this.unsigned() >= other.unsigned()) return true;
        }

        return false;
    }

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
    lessThenOrEqual(): boolean {
        const value = arguments[0];

        if (value instanceof binary && this.unsigned() <= value.unsigned()) return true;
        if (typeof value === 'number' && this.valueOf() <= value) return true; 
        if (typeof value === 'boolean' && this.valueOf() <= (value? 1 : 0)) return true; 
        if (typeof value === 'string' && this.toString() <= value) return true;
        if (Array.isArray(value)) {
            let other = new binary(value.length, value);
            if (this.unsigned() <= other.unsigned()) return true;
        }

        return false;
    }

    // ****************************************
    // *    Conversion From Various Inputs    *
    // ****************************************

    /**
     * Copies *bit values* from another **binary** instance into **this** binary instance.
     * @note Truncates **binary** if it's longer then **this**.
     * @note Pads with 0 if the **binary** is shorter then **this**.
     */
    fromBinary(binary: binary): this;
    fromBinary(): this {
        const argument = arguments[0];

        if (argument === null) throw new NullError(`${this[Symbol.toStringTag]}: given binary can't be null.`);
        if (argument === undefined) throw new UndefinedError(`${this[Symbol.toStringTag]}: given binary can't be undefined.`);
        if (!(argument instanceof binary)) throw new TypeError(`${this[Symbol.toStringTag]}: given binary must be a binary instance.`);
        
        for ( let index: number = this.length - 1, mask: number = argument.length - 1; index >= 0; mask--, index-- ) {
            this[index] = argument[mask];
        }
        
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

        if (array === null) throw new NullError(`${this[Symbol.toStringTag]}: given array can't be null.`);
        if (array === undefined) throw new UndefinedError(`${this[Symbol.toStringTag]}: given array can't be undefined.`);
        if (!Array.isArray(array)) throw new TypeError(`${this[Symbol.toStringTag]}: given array must be an array instance.`);
        if (array.length === 0) throw new EmptyError(`${this[Symbol.toStringTag]}: given array can't be empty.`);

        if (array.every((data) => typeof data === 'boolean')) {
            for ( let index: number = this.length - 1, mask: number = array.length - 1; index >= 0; mask--, index-- ) {
                if (mask >= 0) this[index] = array[mask];
                else this[index] = false;
            }
        }

        if (array.every((data) => typeof data === 'number')) {
            for ( let index: number = this.length - 1, mask: number = array.length - 1; index >= 0; mask--, index-- ) {
                if (mask >= 0) this[index] = array[mask] > 0;
                else this[index] = false;
            }
        }

        if (array.every((data) => typeof data === 'string')) {
            for ( let index: number = this.length - 1, mask: number = array.length - 1; index >= 0; mask--, index-- ) {
                if (mask >= 0 && !isNaN(+array[mask])) this[index] = +array[mask] > 0;
                else this[index] = false;
            }
        }

        return this;
    }

    /**
     * Converts a single *boolean* into **this** binary instance.
     * @note Only the last bit is used; all others are set to 0.
     */
    fromBoolean(value: boolean): this;
    fromBoolean(): this {
        const value = arguments[0];

        if (value === null) throw new NullError(`${this[Symbol.toStringTag]}: given value can't be null.`);
        if (value === undefined) throw new UndefinedError(`${this[Symbol.toStringTag]}: given value can't be undefined.`);
        if (typeof value !== 'boolean') throw new TypeError(`${this[Symbol.toStringTag]}: given value must be a boolean.`);

        for ( let index: number = this.length - 1; index >= 0; index-- ) {
            if (index === this.length - 1) this[index] = value;
            else this[index] = false;
        }

        return this;
    }

    /**
     * Converts a *number* into **this** binary instance.
     * @note Handles both *unsigned* and *signed* values based on **this** *useSigned* flag.
     */
    fromNumber(value: number): this;
    fromNumber(): this {
        const value = arguments[0];

        if (value === null) throw new NullError(`${this[Symbol.toStringTag]}: given value can't be null.`);
        if (value === undefined) throw new UndefinedError(`${this[Symbol.toStringTag]}: given value can't be undefined.`);
        if (typeof value !== 'number') throw new TypeError(`${this[Symbol.toStringTag]}: given value must be a number.`);

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

    /**
     * Converts a *numeric string* into **this** binary instance.
     * @note Handles both *unsigned* and *signed* values based on **this** *useSigned* flag.
     */
    fromString(value: string): this;
    fromString(): this {
        const value = arguments[0];

        if (value === null) throw new NullError(`${this[Symbol.toStringTag]}: given value can't be null.`);
        if (value === undefined) throw new UndefinedError(`${this[Symbol.toStringTag]}: given value can't be undefined.`);
        if (typeof value !== 'string') throw new TypeError(`${this[Symbol.toStringTag]}: given value must be a string.`);
        if (value.length === 0) throw new EmptyError(`${this[Symbol.toStringTag]}: given value can't be an empty string.`);
        if (isNaN(+value)) throw new NaNError(`${this[Symbol.toStringTag]}: given value of '${value}' is not a numeric string.`);

        if (!this.useSigned) {
            for ( let index: number = this.length - 1, mask: number = 1; index >= 0; mask <<= 1, index-- ) {
                this[index] = +value & mask? true : false;
            }
        } else {
            for ( let index: number = this.length - 1, mask: number = 1; index >= 0; mask <<= 1, index-- ) {
                this[index] = +value & mask & this.decimalMask? true : false;
            }
            if (+value < 0) this[0] = true;
        }

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
     * Returns an *unsigned integer* representation of **this** binary instance.
     */
    unsigned(): number {
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
    signed(): number {
        let number: number = this.unsigned();

        if (number & this.signedMask) number = -this.signedMask + (number & this.decimalMask);

        return number;
    }

    /**
     * Used for automatic conversion to primitive *number*.
     */
    valueOf(): number { return this.useSigned? this.signed() : this.unsigned() }

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