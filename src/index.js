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
const report = utils.report;
const provider = TestRPC.provider({
  // gasLimit: '0x14F46B0400',
  gasPrice: '1',
  // verbose: true,
  // logger: console,
});

const accounts = Object.keys(provider.manager.state.accounts);
const web3 = new Web3(provider);
const txObject = { from: accounts[0], gas: 3000000 };

// test each method sequentially...
// 1.. then 2... then 3... and so on
function runTestMethodsSeq(currentIndex, testMethods, contractObject, nextContract, nextMethod) {
  // the next method index to test
  const nextIndex = currentIndex + 1;

  // assemble tx object
  const methodTxObject = Object.assign({}, txObject);
  const eventFilterObject = {};
  const methodName = testMethods[currentIndex].name;
  const methodReport = {
    txObject: methodTxObject,
    index: currentIndex,
    name: methodName,
    status: 'success',
    logs: [],
    startTime: ((new Date()).getTime()),
    duration: 0,
  };

  // assert true log
  const assertTrueLogEvent = contractObject.AssertTrueLog({}, eventFilterObject); // eslint-disable-line

  // watch for log
  assertTrueLogEvent.watch((assertTrueLogError, assertTrueLog) => {
    // handle error
    if (assertTrueLogError) {
      throwError(`error while listening for AssertTrueLog ${assertTrueLogError}`);
    } else {
      // stash log
      methodReport.logs[assertTrueLog.logIndex] = {
        type: 'AssertTrue',
        args: assertTrueLog.args,
        logIndex: assertTrueLog.logIndex,
      };

      // if the logged testValue is false, then report error
      if (assertTrueLog.args._testValue === false) { // eslint-disable-line
        methodReport.status = 'failure';
        assertTrueLogEvent.stopWatching();
        return;
      }
    }
  });

  // complte out method, no errors
  const completeMethod = () => {
    // calculate duration
    methodReport.duration = ((new Date()).getTime()) - methodReport.startTime;

    // compiling contracts
    if (methodReport.status === 'failure') {
      report(`     ${chalk.red(symbols.err)} ${chalk.dim(methodName)} ${chalk.red(`(${methodReport.duration}ms)`)}`);

      methodReport.logs.forEach((methodLog, methodLogIndex) => {
        const message = methodLog.args._message; // eslint-disable-line

        report(`
          -----------------

          ${chalk.red('assertion failed (assertTrue)')}
          index: ${methodLogIndex}
          value (e): true,
          value (a): false,
          message: ${message}
          `);
      });
    } else {
      report(`     ${chalk.green(symbols.ok)} ${chalk.dim(methodName)} ${chalk.red(`(${methodReport.duration}ms)`)}`);
    }

    // fire next method, this is fired every method
    nextMethod(methodReport);

    // new index is less than length
    if (nextIndex < testMethods.length) {
      assertTrueLogEvent.stopWatching();
      runTestMethodsSeq(nextIndex, testMethods, contractObject, nextContract, nextMethod);
    } else {
      // Test contract is complete
      nextContract();
    }
  };

  // fire testmethod tx
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
      getTransactionSuccess(web3, methodTxHash, (txSuccessError) => {
        if (txSuccessError) {
          throwError(`error while getting transaction success method '${methodName}': ${methodError}`);
        } else {
          completeMethod();
        }
      });
    }
  });
}

// test each contract one after the other
// test 1.. test 2... and so on
function testContractsSeq(contractIndex, testContracts, contractComplete) {
  const nextIndex = contractIndex + 1;

  // setup contract variables
  const contractName = testContracts[contractIndex].name;
  const contractABI = JSON.parse(testContracts[contractIndex].interface);
  const contractObject = web3.eth.contract(contractABI);
  const contractBytecode = testContracts[contractIndex].bytecode;
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

  // if contract is a test contract
  if (contractIsTest(contractABI)) {
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
          initialTxObject.value = 500000;
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
          web3.eth.sendTransaction(initialTxObject, (fundError) => {
            if (fundError) {
              throwError(`while funding contract '${contractName}': ${fundError}`);
            } else {
              // run contract setup method
              contractResultObject.setup(setupTxObject, (setupError) => {
                if (setupError) {
                  throwError(`while setting up contract '${contractName}': ${setupError}`);
                } else {
                  // start testing methods sequentially
                  runTestMethodsSeq(startIndex, testMethods, contractResultObject, nextContract, nextMethod);
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
    log('compiling contracts from sources...');

    // compile solc output (sync method)
    const output = solc.compile(compilerInput, optimizeCompiler);

    // handle all compiling errors
    if (output.errors) {
      output.errors.forEach((outputError) => {
        throwError(`while compiling contracts: ${outputError}`);
      });
    } else {
      // compiling contracts
      log('contracts compiled!');

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

${chalk.red(`${reportLogs.failure} not passing`)}
${chalk.green(`${reportLogs.success} passing`)}
`);

          // fire callback
          callback(null, reportLogs);
        } else {
          reportLogs.logs[contractReport.name] = contractReport;
        }
      };

      // test each contract sequentially
      testContractsSeq(startIndex, testContracts, contractComplete);
    }
  });
}

// export wafr module
module.exports = wafr;
