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

 ```
 pragma solidity ^0.4.4;

 import "wafr/Test.sol";

 contract MyTest is Test {
   uint someValue = 5;

   function test_someValueIsFive() {
     assertTrue(someValue == 5, "some value should be 5");
   }
 }
 ```

### Unit Tests

Include the term `test` in any method in your test contract to make it a unit test.

```
pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract MyTest is Test {
  uint someValue;

  function test_someValue() {
    assertTrue(someValue == 0, "some value will be zero");
    assertTrue(someValue != 1, "some value shouldnt be one");
  }

  function test_anotherTest() {
    assertTrue(someValue != 3, "some value shouldnt be three");
  }
}
```

### Unit Testing Throw

Include the terms `test` and `throw` anywhere in your method to make the method a throw unit test. The method test will pass if the method `throw`s.

```
pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract MyTest is Test {
  function test_willThrow() {
    throw;
  }
}
```

Note, `test_willThrow` will be a passing test, as it's expected to `throw`.

### Setup Method

The `setup` method, if stated in your test contract will be executed first before all the unit test methods. This is where you can configure your Test contracts.

```
pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract MyTest is Test {
  uint someValue;

  function setup() {
    someValue = 1;
  }

  function test_someValue() {
    assertTrue(someValue == 1, "some value should be 1");
  }
}
```

### Fauceting

Every contract that inherits the Test contract is immediatly fauceted ether after contract construction, but before the `setup` method is executed. This allows you to move funds around within the contract by using the `.send` method.

```
pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract SomeContract {
}

contract MyTest is Test {
  function test_sendingEther() {
    SomeContract target = new SomeContract();

    assertTrue(target.balance == 0, "should have a balance of zero");

    if (!target.send(1000)) {
      throw;
    }

    assertTrue(target.balance == 1000, "should have a balance of 1000");
  }
}
```

## Gotchas

1. Test contracts must inherit the `wafr/Test.sol` `Test` contract.
2. There are not many assert methods yet
