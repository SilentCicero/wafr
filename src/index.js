// disable console.warn
console.warn = () => {}; // eslint-disable-line

// require modules
const Web3 = require('web3');
const TestRPC = require('ethereumjs-testrpc');
const solc = require('solc');
const utils = require('./utils/index.js');
const chalk = require('chalk');
const testContract = require('./lib/Test.sol.js');
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
const report = utils.report;
const provider = TestRPC.provider({
  gasLimit: 99999999999999999999,
  gasPrice: '1',
  verbose: false,
  logger: { log: () => {} },
  debug: false,
});

const accounts = Object.keys(provider.manager.state.accounts);
const web3 = new Web3(provider);
const txObject = { from: accounts[0], gas: '99999999999999999' };

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
    startTime: ((new Date()).getTime()),
    duration: 0,
  };

  // fire testmethod tx
  const fireTestMethod = () => {
    // assert true log
    const assertEqLogEvent = contractObject.AssertEqLog({}, {}); // eslint-disable-line

    // complte out method, no errors
    const completeMethod = () => {
      // calculate duration
      methodReport.duration = ((new Date()).getTime()) - methodReport.startTime;

      // compiling contracts
      if (methodReport.status === 'failure') {
        report(`     ${chalk.red(symbols.err)} ${chalk.dim(methodName)} ${chalk.red(`(${methodReport.duration}ms)`)}`);

        // cycle through logs and report errors
        methodReport.logs.forEach((methodLog, methodLogIndex) => {
          const message = methodLog.args._message; // eslint-disable-line
          const actual = methodLog.args._actualValue; // eslint-disable-line
          const expected = methodLog.args._expectedValue; // eslint-disable-line

          // if the log status is a failure log
          if (methodLog.status === 'failure') {
            report(`
          -----------------

          ${chalk.red(`assertion failed (${methodLog.type})`)}
          index: ${methodLogIndex}
          value (e): ${actual},
          value (a): ${expected},
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
        assertEqLogEvent.stopWatching();

        runTestMethodsSeq(nextIndex, testMethods, contractObject, nextContract, nextMethod);
      } else {
        // Test contract is complete
        nextContract();
      }
    };

    // watch for log
    assertEqLogEvent.watch((assertEqLogError, assertEqLog) => {
      // handle error
      if (assertEqLogError) {
        throwError(`error while listening for assertEqLog ${assertEqLogError}`);
      } else {
        // stash log
        methodReport.logs[assertEqLog.logIndex] = {
          type: assertEqLog.args._type, // eslint-disable-line
          args: assertEqLog.args,
          logIndex: assertEqLog.logIndex,
          status: 'success',
        };

        // if actual does not equal expected, mark as failure, report error
        if (assertEqLog.args._actualValue !== assertEqLog.args._expectedValue) { // eslint-disable-line
          methodReport.status = 'failure';
          methodReport.logs[assertEqLog.logIndex].status = 'failure';
          assertEqLogEvent.stopWatching();
          return;
        }
      }
    });

    contractObject[methodName](methodTxObject, (methodError, methodTxHash) => {
      // has method error
      if (methodError) {
        if (String(methodName.toLowerCase()).includes('throw')
        && JSON.stringify(methodError.message).includes('JUMP')) {
          completeMethod();
        } else {
          throwError(`error while testing method '${methodName}': ${methodError}`);
        }
      } else {
        // transaction is success
        getTransactionSuccess(web3, methodTxHash, (txSuccessError, txReceipt) => {
          if (txSuccessError) {
            throwError(`error while getting transaction success method '${methodName}': ${methodError}`);
          } else {
            // if success, set the receipt
            methodReport.receipt = txReceipt;

            // complete method processing
            completeMethod();
          }
        });
      }
    });
  };

  // get time increase
  const timeIncrease = getTimeIncreaseFromName(methodName);
  const blockIncrease = getBlockIncreaseFromName(methodName);

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
  const contractBalance = 50000000000;
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
          const testMethods = getTestMethodsFromABI(contractABI);
          const startIndex = 0;
          const initialTxObject = Object.assign({}, txObject);
          initialTxObject.from = accounts[1];
          initialTxObject.value = contractBalance;
          initialTxObject.to = contractResultObject.address;
          const setupTxObject = Object.assign({}, txObject);

          // setup uint log event
          const uintLogEvent = contractResultObject.log_uint({}, {}); // eslint-disable-line

          // watch for uint log
          uintLogEvent.watch((uintLogEventError, logEventResult) => {
            if (uintLogEventError) {
              throwError(`while listening for uint log event: ${uintLogEventError}`);
            } else {
              const logValue = logEventResult.args._logValue; // eslint-disable-line
              const logMessage = logEventResult.args._message; // eslint-disable-line

              report(`
          -----------------

          ${chalk.green('uint log fired')}
          index: ${logEventResult.logIndex}
          value: ${logValue},
          message: ${logMessage}
          `);
            }
          });

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
  const reportLogs = {
    contracts: {},
    status: 'success',
    failure: 0,
    success: 0,
    logs: {},
  };

  // get allinput sources
  getInputSources(contractsPath, (inputError, sources) => {
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
