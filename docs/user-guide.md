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

### Increase EVM Block Numbers

wafr allows you to increase block numbers before a unit test method is fired, just add `_inceaseBlockBy` followed by the amount of blocks to increase by (i.e. `30`) in your test method name.

```
pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract MyTest is Test {
  uint startBlockNumber;

  function setup() {
    startBlockNumber = block.number;
  }

  function test_moreBlocks_increaseBlockBy50() {
    assertTrue((block.number - startBlockNumeber) >= 50, "current block number should be 50 blocks ahead or more.");
  }
}
```

## Increase EVM Time

wafr allows you to increase the EVM time before a test is fired, just add `_increaseTimeBy` to your unit test method name followed by the seconds to increase the EVM (i.e. `3000`); The time will be increased and a single block mined to move the time ahead.

```
pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract MyTest is Test {
  uint startTime;

  function setup() {
    startTime = now;
  }

  function test_moreTimePlease_increaseTimeBy3000() {
    assertTrue((now - startTime) >= 3000, "current EVM time - start time is greater than 3000 seconds");
  }
}
```

### Basic Logging

`log_uint(uint, string)` -- wafr has a single `log_uint` available now, so you can log a `uint` along with a string `message`.

```
pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract MyTest is Test {
  uint someValue = 5000;

  function test_someLog() {
    assertTrue(someValue == 5000, "some value should be 5000");
    log_uint(someValue, "should log 5000 in the console");
  }
}
```

## Gotchas

1. Test contracts must inherit the `wafr/Test.sol` `Test` contract.
2. There are not many assert methods yet
3. You cannot increase the time and block in the same unit test (i.e. you cant use `_increaseTimeBy` and `_increaseBlockBy` in the same test method).
4. Increase time is in seconds.
5. All unit tests need to have `test` somewhere in the method name
6. Unit test methods may not be tested in the order you have written them
7. Funds are sent to your Test contract first, then the `setup` method is called
