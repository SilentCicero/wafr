# Developer Guide

All information regarding contributing to and progressing wafr can be found in this document.

## Install from Source

```
git clone http://github.com/SilentCicero/wafr
npm install
```

## Folder Structure

All module source code is found in the `src` directory. All module helper scripts can be found in the `scripts` folder. These will not need to be touched, and are purely configuration for this repository.

```
./wafr
  ./.github
  ./docs
  ./bin
  ./internals
    ./scripts
  ./src
    ./lib
    ./tests
      ./solidityTests
        ...
    ./utils
```

## Process Steps

wafr goes through several steps when testing Solidity contracts. Here are the broad steps in order.

1. Get contract files
2. Compile contracts found with `test` in the name and that inherits the `Test` contract, thus having a `Test` contract ABI like signature.
3. Then sequantially and arbitrarily start deploying test contracts

----

Contract Setup and Testing Steps:

1. Deploy the contract
2. Then send an ether amount to the test contract
3. Then run the `setup` method, if provided
4. Then begin running methods with `test` in the name
5. Then listen for assert logs and compare values
6. Record all data
7. Output all data, if running in the CMD line, process exit 1 if `failure`, process exit 0 if `success`

## Main source Layout

Within the main source, there are two primary methods `runTestMethodsSeq` and `testContractsSeq`. It uses a blurry generator pattern that will most likely be cleaned up and polished in the end.

The `index.js` also includes the main `wafr` method export.

## API Design

### constructor

[index.js:wafr](../../../blob/master/src/index.js#L313 "Source code on GitHub")

Intakes a single `options` object, and outputs a single `callback` with a testing report.

**Parameters**

-   `options` **Object** the main options object that contains the path to build and test the Test contracts.
-   `callback` **Function** a standard async callback, with an `error`, `result` layout, where the result is a complete report object of all contract method testing logs and data.

callback result **Object**, example:

```
ReportLog {
  status: 'success',     // or failure
  failure: 0,            // total method failure count
  success: 0,            // total method success count
  order: [...]           // the order in which test methods were fired
  logs: {                // contract logs
    ContractLog {        // contract log object
      index: 0,
      name: 'SomeTestContract',
      abi: [...],
      bytecode: '0x...',
      status: 'success',  // or failure
      failure: 0,         // total method failure count for this contract
      success: 0,         // total method success count
      logs: {
        MethodLog {
          txObject: {},   // tx object used
          index: 1,       // Log index from the event
          receipt: {},    // The TX receipt for processing the method
          name: 'test_method', // method name
          status: 'success', // or failure
          logs: [
            ...
          ],
          startTime: date time seconds,
          duration: 0, // method duration test
        }
        ...
      },           
    }
    ...
  },
};
```

Note, this report can be outputed as a JSON file by using the `--stats ./path-to-your-file.json`. The output is generated when the report is complete after all tests have been processed.

## Module Usage

Using the `wafr` module is as simple as requiring wafr and then handling the `options` and `callback` inputs. The `wafr` module is self-contained and doesn't use or interact with `fs` or `path` at all.

```js
const wafr = require('wafr');

wafr({
  path: './contracts/tests',
  optimize: 1,
}, (error, reportObject) => {
  console.log(error, reportObject);
});
```

## CLI

This is the current wafr CLI window.

```
Usage
  $ wafr <path to contract test>

Options
  --help         the help CLI
  --output,  -o  solc compile output to JSON file
  --stats,   -s  stats report of tests to JSON file
  --version, -v  the package verson number

Examples
  $ wafr ./contracts --output ./build/contracts.json
```

## Console

Here is what the wafr test console looks like when some tests pass and some fail.

<img src="https://github.com/SilentCicero/wafr/blob/master/assets/wafr-console.png?raw=true" width="600" />

## Build output

The build output is handled in the `bin` folder. Where it does the work to use the `output` flag is provided, and writes an output build JSON file of the contracts to the specified paths.

## Ordering the firing of setup and teardown methods

Wafr includes setup and teardown methods. If a specific teardown or setup method is notated for a specific method, it will be called.

The firing order:
 1. `setup`
 2. `beforeEach`
 3. `before_[test method name]`
 4. `[test method name]`
 5. `after_[test method name]`
 6. `afterEach`

## Types

Wafr compares the raw AssertEqLog bytes32 data, but displays the information as if it were not byte32 but it's original type. A conversion method is used `bytes32ToType` in order to convert the bytes32 log data into its native type for display.

## Tests

The `wafr` testing hardness has several test cases instantiated in the `./src/tests/` dir. `wafr` is tested by running various test solidity contracts, then based on the output report, determines if it tests properly. Please feel free to add more coverage here and include the main tests in the `./src/tests/index.test.js`.

Note, dont be afraid of all the failing tests, they are suppose to fail to check the accuracy of the `assert` methods.

## Bulky ./src/index.js file

Write now the design of wafr is subpar as all the action happens in the index.js file. This will be broken out eventually into smaller methods and a more robust design.

## Bin

The main `wafr` bin is found in the `bin` folder. This contains the CLI elements for `wafr`. It also triggers the final `process.exit` commands given the outcome of the tests.

## Internals

The `./internals` dir is left to contain all non-source related scripts like checking the npm and nodejs versions. Eventually build steps and other useful scripts are contained there.

## Utilitiy Methods

All `wafr` source utility methods exist in the [`util` folder](../../../blob/master/src/utils). This includes methods like getting all contract sources, parsing, highlighting, symbols etc.

## Solidity Test Harness

The main Solidity Test hardness used by wafr is included in the [`./src/lib/Test.sol`](../../../blob/master/src/lib/Test.sol).

This contains the assertion methods, events, and a default setup method. As well it sets the fallback function to payable, so funds can be sent to the test contract upon construction.

```pragma solidity ^0.4.4;

contract Test {
  function () payable {}

  function setup() {}

  function assertTrue(bool _testValue, string _message) {
    AssertEqLog("AssertTrue", "bool", boolToBytes32(_testValue), boolToBytes32(true), _message);
  }

  function assertTrue(bool _testValue) {
    AssertEqLog("AssertTrue", "bool", boolToBytes32(_testValue), boolToBytes32(true), "");
  }

  function assertFalse(bool _testValue, string _message) {
    AssertEqLog("AssertFalse", "bool", boolToBytes32(_testValue), boolToBytes32(false), _message);
  }

  function assertFalse(bool _testValue) {
    AssertEqLog("AssertFalse", "bool", boolToBytes32(_testValue), boolToBytes32(false), "");
  }

  function assertEq(uint _actual, uint _expected) {
    AssertEqLog("AssertEq", "uint", bytes32(_actual), bytes32(_expected), "");
  }

  function assertEq(bytes32 _actual, bytes32 _expected) {
    AssertEqLog("AssertEq", "bytes32", _actual, _expected, "");
  }

  function assertEq(bytes32 _actual, bytes32 _expected, string _message) {
    AssertEqLog("AssertEq", "bytes32", _actual, _expected, _message);
  }

  function assertEq(int _actual, int _expected) {
    AssertEqLog("AssertEq", "int", bytes32(_actual), bytes32(_expected), "");
  }

  function assertEq(int _actual, int _expected, string _message) {
    AssertEqLog("AssertEq", "int", bytes32(_actual), bytes32(_expected), _message);
  }

  function assertEq(address _actual, address _expected) {
    AssertEqLog("AssertEq", "address", bytes32(_actual), bytes32(_expected), "");
  }

  function assertEq(bool _actual, bool _expected) {
    AssertEqLog("AssertEq", "bool", boolToBytes32(_actual), boolToBytes32(_expected), "");
  }

  function assertEq(uint _actual, uint _expected, string _message) {
    AssertEqLog("AssertEq", "uint", bytes32(_actual), bytes32(_expected), _message);
  }

  function assertEq(address _actual, address _expected, string _message) {
    AssertEqLog("AssertEq", "address", bytes32(_actual), bytes32(_expected), _message);
  }

  function assertEq(bool _actual, bool _expected, string _message) {
    AssertEqLog("AssertEq", "bool", boolToBytes32(_actual), boolToBytes32(_expected), _message);
  }

  function assertEq(string _actual, string _expected) {
    AssertEqLog("AssertEq", "string", sha3(_actual), sha3(_expected), "");
  }

  function assertEq(string _actual, string _expected, string _message) {
    AssertEqLog("AssertEq", "string", sha3(_actual), sha3(_expected), _message);
  }

  function assertEq(bytes _actual, bytes _expected) {
    AssertEqLog("AssertEq", "bytes", sha3(_actual), sha3(_expected), "");
  }

  function assertEq(bytes _actual, bytes _expected, string _message) {
    AssertEqLog("AssertEq", "bytes", sha3(_actual), sha3(_expected), "");
  }

  function boolToBytes32(bool _value) constant returns (bytes32) {
    if (_value == true) {
      return bytes32(uint(1));
    } else {
      return bytes32(uint(0));
    }
  }

  event log_uint(uint256 _logValue, string _message);
  event AssertEqLog(string _assertType, string _type, bytes32 _actualValue, bytes32 _expectedValue, string _message);
}
```

So far this is the test harness. It may change and grow overtime. For now expect this to be the base `Test.sol` harness.

## Todo

There are a few todo items for `wafr`, here are a few of them:

1. `log_string` - will log a string
2. `log_bytes` - will log an address
3. Rendering the actual value, if any, of `bytes32` console log results

## Contributing

Please help better the ecosystem by submitting issues and pull requests to default. We need all the help we can get to build the absolute best linting standards and utilities. We follow the AirBNB linting standard. Please read more about contributing to `wafr` in the `CONTRIBUTING.md`.

## Licence

This project is licensed under the MIT license, Copyright (c) 2016 Nick Dodson. For more information see LICENSE.md.
