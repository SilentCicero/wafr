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
