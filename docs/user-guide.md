# User Guide

All information for developers using wafr should consult this document.

## Install

```
npm install -g wafr

// or locally

npm install --save-dev wafr
```

## Usage

```
wafr ./example/

// or used locally

node ./node_modules/wafr/bin/wafr.js ./example
```

An example test

```
pragma solidity ^0.4.4;

import "wafr/Test.sol";

// inherits the `Test` class
contract MyTest is Test {
  uint firstNumber;
  uint secondNumber;

  // transacted first before the 'test' methods
  function setup() {
    firstNumber = 1;
    secondNumber = 2;
  }

  // includes 'test' in the name
  function test_basicUnitTest() {
    assertTrue(firstNumber != secondNumber, "first number should not equal second number");
  }

  // includes 'throw' in the name, and is a success if it `throw`s
  function test_BasicThrow() {
    if (firstNumber != secondNumber) {
      throw;
    }
  }
}
```

this will produce:

```
node ./bin/wafr.js ./example/

[wafr]: compiling contracts from sources...
[wafr]: contracts compiled!


  MyTest

     ✓ test_basicUnitTest (135ms)
     ✓ test_BasicThrow (19ms)


  0 not passing
  2 passing
```
