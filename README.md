# Libslm (Life is boring so let's make) Binary

![Version](https://img.shields.io/github/package-json/v/Hulle107/libslm-binary?style=for-the-badge)
![License](https://img.shields.io/github/license/Hulle107/libslm-binary?style=for-the-badge)

## 📚 Indexing

- [Libslm (Life is boring so let's make) Binary](#libslm-life-is-boring-so-lets-make-binary)
  - [📚 Indexing](#-indexing)
  - [📢 Introduction](#-introduction)
  - [💾 Binary](#-binary)
    - [🔄 Changes v1.0.7](#-changes-v107)
    - [✨ Features](#-features)
    - [🧩 Primitive Types](#-primitive-types)
    - [💡 Usage Example](#-usage-example)
    - [🛣️ Roadmap](#️-roadmap)
    - [📝 Notes](#-notes)

## 📢 Introduction

Welcome to **Libslm Binary** — a chaotic collection of experiments, half-baked ideas, and bursts of inspiration.
This isn't a polished, production-ready framework. It's a playground for concepts that may or may not evolve into something meaningful.

Due to its experimental nature, **stability is not guaranteed**. Features may change, vanish, or break at any time.
If you're here for reliability, you might want to look elsewhere.
But if you're here out of **curiosity, exploration, or sheer madness** — welcome aboard.

> ⚠️ Use at your own risk. Enjoy the ride.

## 💾 Binary

This library provides low-level, primitive types for working with binary data. These are designed for **precise bit and byte manipulation**, with a focus on fixed-width representations.

> ℹ️ The core challenge in this library is that all binary values are, fundamentally, just numbers. So after performing arithmetic or bitwise operations, values tend to default back to raw numbers, losing their typed wrapper.

### 🔄 Changes v1.0.7

- Removed the use of classes.
- Removed `dword` support (for now) due to the complexity of enforcing size constraints.

### ✨ Features

- **Binary Encapsulation** –Represent numbers as fixed-width binary sequences.
- **Arithmetic & Bitwise Operations** – Perform operations while maintaining binary structure.
- **Signed Value Conversion** – Supports two’s complement interpretation.

### 🧩 Primitive Types

- **bit** – A single binary digit (0 or 1).
- **nibble** – A 4-bit unsigned integer.
- **byte** – A 8-bit unsigned integer.
- **word** – A 16-bit unsigned integer.

### 💡 Usage Example

```typescript
import {byte, byteArray} from 'libslm-binary';

let first: byte = byte(0x41);
console.info(byte.toArray(first));        // [0, 1, 0, 0, 0, 0, 0, 1]
console.info(byte.toString(first));       // 1000001
console.info(byte.toBinary(first));       // 01000001
console.info(byte.toHexadecimal(first));  // 41
console.info(byte.size);                  // 8
console.info(byte.mask);                  // 255

let second: byte = byte(255);
console.info(byte.toSigned(second));      // -127
console.info(byte.valueOf(second));       // 255

let array: byteArray = [1, 0, 0, 1, 1, 0, 0, 0];
let third: byte = byte.fromArray(array);
console.info(third);                      // 152
```

### 🛣️ Roadmap

| Status | Feature |
|:------:|:--------|
| ✅ | Basic implementation |
| ✅ | Basic arithmetic & bitwise operations |
| ✅ | Basic documentation |
| ✅ | Conversion between arrays and types |
| ✅ | Conversion to binary/hex strings |
| ✅ | Signed value support |
| ✅ | Performance improvements |
| 🔲 | Advanced documentation |
| 🔲 | Floating-point support |

### 📝 Notes

These types serve as **foundational tools** for binary manipulation.
Given the library's experimental status, expect things to **evolve** — or get scrapped entirely.
