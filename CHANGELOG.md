# 0.2.6 -- setup and teardown methods

1. Added setup and teardown methods `beforeEach`, `afterEach`, `before_{}`, `after_{}`
2. Added more user-docs
3. More test coverage

# 0.2.5 -- stats file upgrades

1. Generate stats file even under failure
2. New lines in stats file
3. Removed web3 log/watching completely for better performance and reliability

# 0.2.4 -- type value convertion

1. logs now have type value convertion for `uint`, `int`, `address`, `bool`, and shows type comparison
2. More docs
3. Adjustment to the `Test.sol` to support types

# 0.2.3 -- TestRPC upgrade

1. Upgraded TestRPC from `3.0.1` to `3.0.2`
2. `package.json` -- Require npm version 3+ and node 6+
3. More test coverage on gas usage
4. Further error enhancements on `out of gas` errors
5. Docker support
6. Better CLI help/information error handling
7. `--stats ./stats.json` -- output test report as JSON file
8. Fix non-deterministic Invalid Jump from `ethereumjs-vm`
9. CLI test coverage

# 0.2.2 -- method ordering, chaining

1. Test methods are now ordered by name to ensure chaining
2. Fixed test method success status during uncaught `throw`
3. More test coverage
4. More doc examples
5. Readme update

# 0.2.1 -- add tx receipt to report

1. Add tx receipt per method test for reporting
2. Readme docs update, dev and user docs
3. `assertEq` type `bytes32` added
4. More test coverage, rigidity and expectations
5. Error enhancement for errors that throw `throwError`
6. Disable `console.warn` messages from ProviderEngine

# 0.2.0 -- bin output path fix, large contract fix

1. Handle build path when it is `undefined`
2. Fix gas errors
3. Test deployment of large contracts
4. More docs

# 0.1.9 -- more path fixed, output contracts build

1. More path fixes.. i.e. `.test.sol` or `~test.sol`
2. Output build chain using the `--output` option
3. Expanded TestRPC `gasLimit`
4. More user guide docs
5. CLI enhancement with `--help` examples and options

# 0.1.8 -- fix non .sol paths

1. Fix non `.sol` file paths from being compiled
2. Add path and build related docs

# 0.1.7 -- assertEq, New Logging System, More tests

1. Added `assertEq`, supported types `bool`, `uint`, `string`, `bytes`, `address`, `int`
2. Added new logging system to accomidate `assertEq`
3. More user-docs and recomendations
4. More test coverage of new features
5. Added `assertFalse` support
6. Remove `--root` property from example script
7. Test coverage on dir depth

# 0.1.6 -- Increase EVM/Block Time Features, log_uint, more docs

1. Added `_increaseTimeBy` feature, increase time by seconds before test
2. Added `_increaseBlockBy` feature, increase blocks by number before test
3. `log_uint` -- added uint logging (uint, string)
4. Added more feature docs in `user-guide`
5. Added coverage for increase time/block features
6. Made some console updates

# 0.1.5 -- Fix fauceting, setup success, more user-guide docs

1. Fixed fauceting
2. Fixed setup async waiting
3. More `user-guide` doc examples
4. More test coverage (empty test dir, invalid tests, fauceting tests)
5. Developer guide todo's.

# 0.1.4 -- Fix dependancies, readme update

1. Fix `package.json` dependancies
2. Update readme usage example

# 0.1.3 -- Remove Test.sol loading/resolving

1. Remove `root` CLI option
2. Remove resolve/loading of Test.sol => require('Test.sol.js')
3. Document additions and cleanup in user-guide

# 0.1.0 -- Scaffolding, Docs, First Commit, Basic Tests

1. Code of Conduct established
2. Contributing rules
3. Readme Basics
4. Changelog established
5. JS linting standard selected (AirBNB)
6. Basic index.js entry
7. `.editorconfig` file
8. `.gitattributes` file
9. `.gitignore` file
10. Travis scaffolding
11. Licence established
12. Basic testing coverage
13. Documentation
14. Bin file `wafr.js` cli using meow
