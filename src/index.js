// disable console.warn
console.warn = () => {}; // eslint-disable-line

// require modules
const Web3 = require('web3');
const TestRPC = require('ethereumjs-testrpc');
const solc = require('solc');
const utils = require('./utils/index.js');
const chalk = require('chalk');
const testContract = require('./lib/Test.sol.js');
const Interface = require('ethers-wallet').Interface;
const throwError = utils.throwError;
const symbols = utils.symbols;
const log = utils.log;
const getInputSources = utils.getInputSources;
const contractIsTest = utils.contractIsTest;
const getTestMethodsFromABI = utils.getTestMethodsFromABI;
const buildTestContractsArray = utils.buildTestContractsArray;
const getTransactionSuccess = utils.getTransactionSuccess;
const getTimeIncreaseFromName = utils.getTimeIncreaseFromName;
const increaseProviderTime = utils.increaseProviderTime; // eslint-disable-line
const increaseProviderBlock = utils.increaseProviderBlock;
const getBlockIncreaseFromName = utils.getBlockIncreaseFromName;
const sortABIByMethodName = utils.sortABIByMethodName;
const bytes32ToType = utils.bytes32ToType; // eslint-disable-line
const report = utils.report;
const accountsObject = [];
for(var i = 0; i < 1000; i++) { // eslint-disable-line
  accountsObject[i] = { index: i, balance: '0x6d79f82328ea3da61e066ebb2eaa9494c589c000' };
}
const provider = TestRPC.provider({
  gasLimit: '99999999999999999999999999999', // '99999999999999999999'
  gasPrice: '1',
  verbose: false,
  logger: { log: () => {} },
  debug: false,
  accounts: accountsObject,
});
const accounts = Object.keys(provider.manager.state.accounts);
const web3 = new Web3(provider);
const txObject = { from: accounts[0], gas: '99999999999999999999999999999' };

// test each method sequentially...
// 1.. then 2... then 3... and so on
function runTestMethodsSeq(currentIndex, testMethods, contractObject, nextContract, nextMethod) {
  // if contract has no tests, then skip the test contract
  if (testMethods.length === 0) {
    // Test contract is complete
    nextContract();
    return;
  }

  // the next method index to test
  const nextIndex = currentIndex + 1;

  // assemble tx object
  const methodTxObject = Object.assign({}, txObject);
  const methodName = testMethods[currentIndex].name;
  const methodReport = {
    txObject: methodTxObject,
    index: currentIndex,
    name: methodName,
    receipt: {},
    status: 'success',
    logs: [],
    uncaughtThrow: false,
    startTime: ((new Date()).getTime()),
    duration: 0,
  };

  // fire testmethod tx
  const fireTestMethod = () => {
    // assert true log
    const assertEqLogEvent = contractObject.AssertEqLog({}, {}); // eslint-disable-line

    // fire after each method
    const afterEachMethod = () => {
      contractObject.afterEach(Object.assign({}, methodTxObject), (afterEachError, afterEachTxHash) => {
        if (afterEachError) {
          throwError(`while firing afterEach method after method ${methodName}: ${afterEachError}`);
        } else {
          getTransactionSuccess(web3, afterEachTxHash, (txSuccessError) => {
            if (txSuccessError) {
              throwError(`error while getting transaction method success for afterEach method after '${methodName}': ${txSuccessError}`);
            } else {
              completeMethod();
            }
          });
        }
      });
    };

    // setup fire test method after testing it
    const setupCompleteMethod = () => {
      // if after method available, fire it
      if (typeof contractObject[`after_${methodName}`] === 'function') {
        // before each
        contractObject[`after_${methodName}`](Object.assign({}, methodTxObject), (afterError, afterTxHash) => {
          if (afterError) {
            throwError(`while firing before_${methodName} after method ${methodName}: ${afterError}`);
          } else {
            getTransactionSuccess(web3, afterTxHash, (txSuccessError) => {
              if (txSuccessError) {
                throwError(`error while getting transaction method success for method 'after_${methodName}' before method '${methodName}': ${txSuccessError}`);
              } else {
                // fire after each method, then complete test
                afterEachMethod();
              }
            });
          }
        });
      } else {
        // complete afterEach method then complete test
        afterEachMethod();
      }
    };

    // complte out method, no errors
    const completeMethod = () => {
      // calculate duration
      methodReport.duration = ((new Date()).getTime()) - methodReport.startTime;

      // report all non comparison logs
      methodReport.logs.forEach((methodLog, methodLogIndex) => {
        // if it is not a comparison log
        if (methodLog.comparison === false) {
          const message = methodLog.args._message; // eslint-disable-line
          const logValue = methodLog.args._logValue; // eslint-disable-line

          // report uint log
          report(`
        -----------------

        ${chalk.green('log uint256 value')}
        index: ${methodLogIndex}
        value: ${logValue}
        message: ${message}
          `);
        }
      });

      // compiling contracts
      if (methodReport.status === 'failure') {
        report(`     ${chalk.red(symbols.err)} ${chalk.dim(methodName)} ${chalk.red(`(${methodReport.duration}ms)`)}`);

        // if the log status is a failure log
        if (methodReport.uncaughtThrow === true) {
          report(`
        -----------------

        ${chalk.red('assertion failed (assertThrow)')}
        index: no index
        type: throw
        value (e): VM 'Invalid Jump'
        value (a): TX success
        message: Expected method to throw causing VM 'Invalid Jump', method transacted without invalid jump.
          `);
        }

        // cycle through logs and report errors
        methodReport.logs.forEach((methodLog, methodLogIndex) => {
          const message = methodLog.args._message; // eslint-disable-line
          const logType = methodLog.type;

          // if the log status is a failure log
          if (methodLog.comparison === true && methodLog.status === 'failure') {
            const actual = bytes32ToType(logType, methodLog.args._actualValue); // eslint-disable-line
            const expected = bytes32ToType(logType, methodLog.args._expectedValue); // eslint-disable-line

            report(`
          -----------------

          ${chalk.red(`assertion failed (${methodLog.assertType})`)}
          index: ${methodLogIndex}
          type: ${logType}
          value (e): ${actual}
          value (a): ${expected}
          message: ${message}
            `);
          }
        });
      } else {
        report(`     ${chalk.green(symbols.ok)} ${chalk.dim(methodName)} ${chalk.red(`(${methodReport.duration}ms)`)}`);
      }

      // fire next method, this is fired every method
      nextMethod(methodReport);

      // new index is less than length
      if (nextIndex < testMethods.length) {
        runTestMethodsSeq(nextIndex, testMethods, contractObject, nextContract, nextMethod);
      } else {
        // Test contract is complete
        nextContract();
      }
    };

    contractObject[methodName](methodTxObject, (methodError, methodTxHash) => {
      // has method error
      if (methodError) {
        if (String(methodName.toLowerCase()).includes('throw')
        && (JSON.stringify(methodError.message).toLowerCase().includes('jump')
        || JSON.stringify(methodError.message).toLowerCase().includes('vm exception')
        || JSON.stringify(methodError.message).toLowerCase().includes('out of gas'))) {
          setupCompleteMethod();
        } else {
          throwError(`error while testing method '${methodName}': ${methodError}`);
        }
      } else {
        // if the method is expected to throw and doesn't, report failure
        if (String(methodName.toLowerCase()).includes('throw')) {
          methodReport.status = 'failure';
          methodReport.uncaughtThrow = true;
        }

        // transaction is success
        // set timeout to wait for log propigation
        getTransactionSuccess(web3, methodTxHash, (txSuccessError, txReceipt) => {
          if (txSuccessError) {
            throwError(`error while getting transaction success method '${methodName}': ${methodError}`);
          } else {
            // if success, set the receipt
            methodReport.receipt = txReceipt;

            // if the receipt has logs
            if (txReceipt.logs.length > 0) {
              // go through logs, find AssertEq logs
              for (var logIndex = 0; logIndex < txReceipt.logs.length; logIndex++) { // eslint-disable-line
                // if log is a uint log `log_uint`
                if (txReceipt.logs[logIndex].topics.includes('0x5a71b4cb8bb5bc53d31d782572a043ec542e2d000214f85ace0bbe93131dc98a')) {
                  // decode the log data
                  const logData = Interface.decodeParams(['uint256', 'string'], txReceipt.logs[logIndex].data);

                  // build a log object similar to web3
                  const logDataObject = {
                    _logValue: logData[0],
                    _message: logData[1],
                  };

                  // log value, log message
                  const logValue = logDataObject._logValue; // eslint-disable-line
                  const logMessage = logDataObject._message; // eslint-disable-line

                  // report log data if necessary
                  methodReport.logs[logIndex] = {
                    comparison: false,
                    type: 'uint256',
                    args: logDataObject,
                    logIndex,
                  };
                }

                // if the log is an AssertEq log
                if (txReceipt.logs[logIndex].topics.includes('0xd59a9828799793dbbfb45a334a81ebcf5a204d2ff45f7ee7561756b5d2d3c4b2')) {
                  // decode the log data
                  const logData = Interface.decodeParams(['string', 'string', 'bytes32', 'bytes32', 'string'], txReceipt.logs[logIndex].data);

                  // build a log object similar to web3
                  const logDataObject = {
                    _assertType: logData[0],
                    _type: logData[1],
                    _actualValue: logData[2],
                    _expectedValue: logData[3],
                    _message: logData[4],
                  };

                  // report log data if necessary
                  methodReport.logs[logIndex] = {
                    comparison: true,
                    assertType: logDataObject._assertType, // eslint-disable-line
                    type: logDataObject._type, // eslint-disable-line
                    args: logDataObject,
                    logIndex,
                    status: 'success',
                  };

                  // if actual does not equal expected, mark as failure, report error
                  if (logDataObject._actualValue !== logDataObject._expectedValue) { // eslint-disable-line
                    methodReport.status = 'failure';
                    methodReport.logs[logIndex].status = 'failure';
                  }
                }
              }
            }

            // complete method processing
            setupCompleteMethod();
          }
        });
      }
    });
  };

  // get time increase
  const timeIncrease = getTimeIncreaseFromName(methodName);
  const blockIncrease = getBlockIncreaseFromName(methodName);

  // setup fire test method before testing it
  const setupTestMethod = () => {
    // if there is an increase time command
    // then increase the time and mine a block
    if (timeIncrease > 0) {
      increaseProviderTime(provider, timeIncrease, (increaseTimeError) => {
        if (increaseTimeError) {
          throwError(`error while increasing TestRPC provider time by ${timeIncrease} seconds: ${increaseTimeError}`);
        } else {
          fireTestMethod();
        }
      });
    } else {
      if (blockIncrease > 0) {
        increaseProviderBlock(provider, blockIncrease, (increaseBlockError) => {
          if (increaseBlockError) {
            throwError(`error while increasing TestRPC provider by ${blockIncrease} blocks: ${increaseBlockError}`);
          } else {
            fireTestMethod();
          }
        });
      } else {
        // fire the test method
        fireTestMethod();
      }
    }
  };

  // fire before method
  const fireBeforeMethod = () => {
    // before each
    contractObject[`before_${methodName}`](Object.assign({}, methodTxObject), (beforeError, beforeTxHash) => {
      if (beforeError) {
        throwError(`while firing before_${methodName} before method ${methodName}: ${beforeError}`);
      } else {
        getTransactionSuccess(web3, beforeTxHash, (txSuccessError) => {
          if (txSuccessError) {
            throwError(`error while getting transaction method success for before_${methodName} method before '${methodName}': ${txSuccessError}`);
          } else {
            setupTestMethod();
          }
        });
      }
    });
  };

  // before each
  contractObject.beforeEach(Object.assign({}, methodTxObject), (beforeEachError, beforeEachTxHash) => {
    if (beforeEachError) {
      throwError(`while firing beforeEach method before method ${methodName}: ${beforeEachError}`);
    } else {
      getTransactionSuccess(web3, beforeEachTxHash, (txSuccessError) => {
        if (txSuccessError) {
          throwError(`error while getting transaction method success for beforeEach method before '${methodName}': ${txSuccessError}`);
        } else {
          // if before method available, fire it
          if (typeof contractObject[`before_${methodName}`] === 'function') {
            fireBeforeMethod();
          } else {
            setupTestMethod();
          }
        }
      });
    }
  });
}

// test each contract one after the other
// test 1.. test 2... and so on
function testContractsSeq(contractIndex, testContracts, contractComplete) {
  // check if this contract is defined
  // if its not defined, then skip this contract
  if (typeof testContracts[contractIndex] === 'undefined') {
    contractComplete(false);
    return;
  }

  // next index
  const nextIndex = contractIndex + 1;

  // setup contract variables
  const contractName = testContracts[contractIndex].name;
  const contractABI = JSON.parse(testContracts[contractIndex].interface);
  const contractObject = web3.eth.contract(contractABI);
  const contractBytecode = testContracts[contractIndex].bytecode;
  const contractBalance = '0xc9f2c9cd04674edea40000';
  const contractTxObject = Object.assign({ data: contractBytecode },
    Object.assign({}, txObject));

  // contract report
  const contractReport = {
    index: contractIndex,
    name: contractName,
    abi: contractABI,
    bytecode: contractBytecode,
    status: 'success',
    failure: 0,
    success: 0,
    order: [],
    logs: {},
  };

  // compiling contracts
  report(`

  ${contractName}
    `);

  // if contract is not a test, skip the contract
  // else start testing the contract
  if (!contractIsTest(contractABI)) {
    // if the next contract doesnt exist, complete testing
    if (typeof testContracts[nextIndex] === 'undefined') {
      // fire the final done method
      contractComplete(false);
    } else {
      testContractsSeq(nextIndex, testContracts, contractComplete);
    }
  } else {
    // deploy a new instantiation of that test
    contractObject.new(contractTxObject, (contractError, contractResult) => {
      // contract error
      if (contractError) {
        throwError(`while deploying contract '${contractName}': ${contractError}`);
      } else {
        // if contract result has deployed, run contract tests
        if (contractResult.address) {
          const contractResultObject = contractResult;
          const testMethods = sortABIByMethodName(getTestMethodsFromABI(contractABI));
          const startIndex = 0;
          const initialTxObject = Object.assign({}, txObject);
          initialTxObject.from = accounts[nextIndex + 1];
          initialTxObject.value = contractBalance;
          initialTxObject.to = contractResultObject.address;
          const setupTxObject = Object.assign({}, txObject);

          // next method method
          const nextMethod = (methodLog) => {
            // if any method failed, then set failure status for contract
            if (methodLog.status === 'failure') {
              contractReport.status = 'failure';
              contractReport.failure += 1;
            } else {
              contractReport.success += 1;
            }

            // method logs
            contractReport.order.push(methodLog.name);
            contractReport.logs[methodLog.name] = methodLog;
          };

          // if the next
          const nextContract = () => {
            // fire the final done method
            contractComplete(contractReport);

            // next contract
            if (nextIndex < testContracts.length) {
              testContractsSeq(nextIndex, testContracts, contractComplete);
            } else {
              // fire the final done method
              contractComplete(false);
            }
          };

          // send money to contract
          web3.eth.sendTransaction(initialTxObject, (fundError, txHash) => {
            if (fundError) {
              throwError(`while funding contract '${contractName}': ${fundError}`);
            } else {
              // check that init transaction was sent
              getTransactionSuccess(web3, txHash, (fundSuccessError) => {
                if (fundSuccessError) {
                  throwError(`while checking funding tx contract '${contractName}': ${fundSuccessError}`);
                } else {
                  // run contract setup method
                  contractResultObject.setup(setupTxObject, (setupError, setupTxHash) => {
                    if (setupError) {
                      throwError(`while setting up contract '${contractName}': ${setupError}`);
                    } else {
                      // check setup transaction
                      getTransactionSuccess(web3, setupTxHash, (setupSuccessError) => {
                        if (setupSuccessError) {
                          throwError(`while checking setting up contract '${contractName}': ${setupSuccessError}`);
                        } else {
                          // start testing methods sequentially
                          runTestMethodsSeq(startIndex, testMethods, contractResultObject, nextContract, nextMethod);
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      }
    });
  }
}

// run the main solTest export
function wafr(options, callback) {
  const contractsPath = options.path;
  const optimizeCompiler = options.optimize;
  const sourcesExclude = options.exclude;
  const sourcesInclude = options.include;
  const reportLogs = {
    contracts: {},
    status: 'success',
    failure: 0,
    success: 0,
    logs: {},
  };

  // get allinput sources
  getInputSources(contractsPath, sourcesExclude, sourcesInclude, (inputError, sources) => {
    if (inputError) {
      throwError(`while getting input sources: ${inputError}`);
    }

    // build contract sources input for compiler
    const compilerInput = {
      sources: Object.assign({ 'wafr/Test.sol': testContract }, sources),
    };

    // compiling contracts
    log(`compiling contracts from ${Object.keys(sources).length} sources...`);

    // compile solc output (sync method)
    const output = solc.compile(compilerInput, optimizeCompiler);

    // handle all compiling errors
    if (output.errors) {
      output.errors.forEach((outputError) => {
        throwError(`while compiling contracts in path ${contractsPath}: ${outputError}`);
      });
    } else {
      // compiling contracts
      log('contracts compiled!');

      // add output to report
      reportLogs.contracts = output.contracts;

      // find and build test contracts array
      const testContracts = buildTestContractsArray(output.contracts);
      const startIndex = 0;

      // done function
      const contractComplete = (contractReport) => {
        // if contract failed, then all tests fail
        if (contractReport !== false) {
          if (contractReport.status === 'failure') {
            reportLogs.status = 'failure';
            reportLogs.failure += contractReport.failure;
          } else {
            reportLogs.success += contractReport.success;
          }
        }

        // if contract report is false, there is no more contracts to test
        if (contractReport === false) {
          // report done in log
          report(`

  ${reportLogs.failure && chalk.red(`${reportLogs.failure} not passing`) || ''}
  ${reportLogs.success && chalk.green(`${reportLogs.success} passing`) || ''}
`);

          // report logs
          callback(null, reportLogs);
        } else {
          reportLogs.logs[contractReport.name] = contractReport;
        }
      };

      // if no test contracts, end testing
      if (testContracts.length === 0) {
        contractComplete(false);
      } else {
        // test each contract sequentially
        testContractsSeq(startIndex, testContracts, contractComplete);
      }
    }
  });
}

// export wafr module
module.exports = wafr;
