# Libslm (Life is boring so let's make) Binary

![Version](https://img.shields.io/github/package-json/v/Hulle107/libslm-binary?style=for-the-badge)
![License](https://img.shields.io/github/license/Hulle107/libslm-binary?style=for-the-badge)

## Indexing

- [Libslm (Life is boring so let's make) Binary](#libslm-life-is-boring-so-lets-make-binary)
  - [Indexing](#indexing)
  - [Introduction](#introduction)
  - [Binary](#binary)
    - [Changes v1.0.6](#changes-v106)
    - [Features](#features)
    - [Primitive Types](#primitive-types)
    - [Usage Example](#usage-example)
    - [Roadmap](#roadmap)
    - [Notes](#notes)

## Introduction

Welcome to this library—a chaotic collection of experiments, half-baked ideas, and random bursts of inspiration. This is not a polished, production-ready framework but rather a playground for concepts that may or may not evolve into something useful.

Because of its experimental nature, stability is not guaranteed. Features may change, disappear, or break without warning. If you're looking for a dependable tool, you might want to look elsewhere. But if you're here for curiosity, exploration, or sheer madness, welcome aboard!

Use at your own risk, and enjoy the ride.

## Binary

This library provides a set of primitive type classes for working with binary data at a low level. These classes are designed to represent fundamental binary structures, allowing for precise manipulation of bits and bytes.

### Changes v1.0.6

- Added static function support for classes.
- Refacted code to be more readable.
- Changed 'unsigned()' and 'signed()' to be get functions.
- Added testing.
- Small performance boost, but need to finde a way to find the bottleneck better.

### Features

- **Encapsulation of Binary Data** – Represent numbers as fixed-width bit sequences.
- **Basic Arithmetic & Bitwise Operations** – Perform operations while maintaining binary integrity.
- **Signed value convertion** – Get values in a *Two's complement* format.
- **Command chaining** – Operations can be chained together.

### Primitive Types

- **binary** – A general size of bits (used to define own sizes).
- **bit** – A single binary digit (0 or 1).
- **nibble** – A 4-bit integer.
- **byte** – A 8-bit integer.
- **word** – A 16-bit integer.
- **dword** – A 32-bit integer.

### Usage Example

```typescript
import {byte} from 'libslm-binary';

let first: byte = new byte(65);
console.info(first.toString() + 1); // 651
console.info(first.valueOf() + 1);  // 66
console.info(first.length);         // 8
console.info(first[1]);             // 1 <───┐
                                    //   [0, 1, 0, 0, 0, 0, 0, 1]

let second: byte = new byte(255);
second.add(1);
second.subtract(1);

let third: number = second.signed;

console.info(first.toBinaryString(true));       // 0b01000001
console.info(second.toHexadecimalString(true)); // 0xFF
console.info(third);                            // -1
```

### Roadmap

- ✅ – Basic implementation of classes.
- ✅ – Basic arithmetic & bitwise operations.
- ✅ – Basic documentation.
- ✅ – Basic error messages and handling.
- ✅ – Convertion between *number* and classes.
- ✅ – Convertion between *string* and classes.
- ✅ – Convertion between *array* and classes.
- ✅ – Convertion to binary or hexdecimal *string*.
- ✅ – Support for signed values.
- 🔲 – Advance documentation.
- 🔲 – Improve performance.

### Notes

These classes serve as fundamental building blocks for binary manipulation. Since this library is experimental, implementations may change as new ideas emerge.
