<img src="https://github.com/SilentCicero/wafr/blob/master/assets/wafr-logo.png">

## wafr

<div>
  <!-- Dependency Status -->
  <a href="https://david-dm.org/SilentCicero/wafr">
    <img src="https://david-dm.org/SilentCicero/wafr.svg" alt="Dependency Status" />
  </a>

  <!-- devDependency Status -->
  <a href="https://david-dm.org/SilentCicero/wafr#info=devDependencies">
    <img src="https://david-dm.org/SilentCicero/wafr/status.svg" alt="devDependency Status" />
  </a>

  <!-- Build Status -->
  <a href="https://travis-ci.org/SilentCicero/wafr">
    <img src="https://travis-ci.org/SilentCicero/wafr.svg" alt="Build Status" />
  </a>

  <!-- Test Coverage -->
  <a href="https://coveralls.io/r/SilentCicero/wafr">
    <img src="https://coveralls.io/repos/github/SilentCicero/wafr/badge.svg" alt="Test Coverage" />
  </a>

  <!-- NPM Version -->
  <a href="https://www.npmjs.org/package/wafr">
    <img src="http://img.shields.io/npm/v/wafr.svg" alt="NPM version" />
  </a>

  <!-- Javascript Style -->
  <a href="http://airbnb.io/javascript/">
    <img src="https://img.shields.io/badge/code%20style-airbnb-brightgreen.svg" alt="js-airbnb-style" />
  </a>
</div>

<br />

A super simple Solidity contract testing harness.

## Install

```
npm install -g wafr
```

## Usage

```
wafr ./example

// or locally

node ./node_modules/wafr/bin/wafr.js ./example
```

```
// found in: ./example/test.example.sol
pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract MyTest is Test {
  uint firstNumber;
  uint secondNumber;

  function setup() {
    firstNumber = 1;
    secondNumber = 2;
  }

  function test_basicUnitTest() {
    assertTrue(firstNumber != secondNumber, "first number should not equal second number");
  }

  function test_BasicThrow() {
    if (firstNumber != secondNumber) {
      throw;
    }
  }
}
```

Note, run `npm run example` to see this example above in action.

## About

Wafr was created to serve as a very basic testing harness for Solidity contracts. It simply compiles your contracts, then provides a `Test` class that can be inherited to test various contracts.

Wafr acts as a simple testing system. It does very little:

1. Compiles contracts
2. Deployes any contract with `test` in filename that inherits `wafr/Test.sol`
3. Sends some ether to the test contract
4. Runs the `setup` method, if any
5. Then runs any method with `test` in the name
6. Then it tests everything against the `assertTrue` method

## Contributing

Please help better the ecosystem by submitting issues and pull requests to default. We need all the help we can get to build the absolute best linting standards and utilities. We follow the AirBNB linting standard. Please read more about contributing to `wafr` in the `CONTRIBUTING.md`.

## Guides

You'll find more detailed information on using default and tailoring it to your needs in our guides:

- [User guide](docs/user-guide.md) - Usage, configuration, FAQ and complementary tools.
- [Developer guide](docs/developer-guide.md) - Contributing to default and writing your own plugins & formatters.

## Help out

There is always a lot of work to do, and will have many rules to maintain. So please help out in any way that you can:

- Create, enhance, and debug rules (see our guide to ["Working on rules"](CONTRIBUTING.md)).
- Improve documentation.
- Chime in on any open issue or pull request.
- Open new issues about your ideas for making stylelint better, and pull requests to show us how your idea works.
- Add new tests to *absolutely anything*.
- Create or contribute to ecosystem tools, like the plugins for Atom and Sublime Text.
- Spread the word.

Please consult our [Code of Conduct](CODE_OF_CONDUCT.md) and [Contributing](.github/CONTRIBUTING.md) docs before helping out.

We communicate via [issues](https://github.com/SilentCicero/wafr/issues) and [pull requests](https://github.com/SilentCicero/wafr/pulls).

## Important documents

- [Changelog](CHANGELOG.md)
- [Contributing Guidelines](.github/CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [License](https://raw.githubusercontent.com/SilentCicero/wafr/master/LICENSE)

## Licence

This project is licensed under the MIT license, Copyright (c) 2016 Nick Dodson. For more information see LICENSE.md.

```
The MIT License

Copyright (c) 2016 Nick Dodson. nickdodson.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
