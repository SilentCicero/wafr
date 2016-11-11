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

## Features

### Assertion Methods

 `assertTrue` (bool testValue, string message)

### Unit Tests

Include the term `test` in any method in your test contract to make it a unit test.

### Unit Testing Throw

Include the terms `test` and `throw` anywhere in your method to make the method a throw unit test. The method test will pass if the method `throw`s.

### Setup Method

The `setup` method, if stated in your test contract will be executed first before all the unit test methods. This is where you can configure your Test contracts.

### Fauceting

Every contract that inherits the Test contract is immediatly fauceted ether after contract construction, but before the `setup` method is executed. This allows you to move funds around within the contract by using the `.send` method.
