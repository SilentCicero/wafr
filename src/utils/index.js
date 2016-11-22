const dir = require('node-dir');
const ethUtil = require('ethereumjs-util');

// function to handle throwing an errorin sol-test
function throwError(error) {
  const enhancement = errorEnhancement(error);

  throw new Error(`[wafr] ERROR: ${error}

    ${enhancement && `Error Enhancement:

      ${enhancement}
      ` || ''}
    `);
}

// normal system log
function log(message) {
  console.log(`[wafr]: ${message}`); // eslint-disable-line
}

// report log
function report(message) {
  console.log(message); // eslint-disable-line
}

// build test contracts array
// all contracts in input that ares Tests, run
function buildTestContractsArray(contractsInput) {
  const testContracts = [];
  const contracts = Object.assign({}, contractsInput);

  // contracts
  for (var contractName in contracts) { // eslint-disable-line
    if (contractName !== 'Test'
      && contractName.toLowerCase().includes('test')) {
      contracts[contractName].name = contractName;
      testContracts.push(contracts[contractName]);
    }
  }

  // output test contracts array
  return testContracts;
}

// get test method objects from a contract ABI
// if method name includes 'test' then include it in array
function getTestMethodsFromABI(contractABI) {
  const testMethods = [];

  // if the method name has test in it, get object
  contractABI.forEach((methodABI, methodIndex) => {
    if (typeof methodABI.name === 'string'
      && methodABI.name.includes('test')
      && methodABI.name.indexOf('before_') !== 0 // no before
      && methodABI.name.indexOf('after_') !== 0) {
      testMethods.push(contractABI[methodIndex]);
    }
  });

  // return test methods
  return testMethods;
}

// if the filename is not test like
function nonTestFileName(filename) {
  return !filename.toLowerCase().includes('test');
}

// get all non-test files from build sources
function filterTestsFromOutput(sources) {
  const outputObject = {};

  Object.keys(sources).forEach((sourceName) => {
    if (nonTestFileName(sourceName)) {
      outputObject[sourceName] = Object.assign({}, sources[sourceName]);
    }
  });

  return outputObject;
}

const BN = require('bn.js');

// bytes32 to number
function bytes32ToInt(value) {
  return (new BN(ethUtil.toBuffer(value))).toString(10);
}

// bytes32 to type
function bytes32ToType(type, value) {
  switch (type) {
    case 'address':
      return `0x${ethUtil.stripHexPrefix(value).slice(24)}`;
    case 'bool':
      return (ethUtil.stripHexPrefix(value).slice(63) === '1');
    case 'int':
      return bytes32ToInt(value);
    case 'uint':
      return bytes32ToInt(value);
    default:
      return value;
  }
}

// return the extension of a filename as a string
function filenameExtension(filename) {
  return filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
}

// get all contract input sources
function getInputSources(dirname, callback) {
  let filesRead = 0;
  const sources = {};

  // get all file names
  dir.files(dirname, (filesError, files) => {
    if (filesError) {
      throwError(`while while getting input sources ${filesError}`);
    }

    // if no files in directory, then fire callback with empty sources
    if (files.length === 0) {
      callback(null, sources);
    } else {
      // read all files
      dir.readFiles(dirname, (readFilesError, content, filename, next) => {
        if (readFilesError) {
          throwError(`while getting input sources ${readFilesError}`);
        }

        // parsed filename
        const parsedDirName = dirname.replace('./', '');
        const parsedFileName = filename.replace(parsedDirName, '').replace(/^\//, '');
        const onlyFilename = filename.substr(filename.lastIndexOf('/') + 1);

        // add input sources to output
        if (filename.substr(filename.lastIndexOf('.') + 1) === 'sol'
          && onlyFilename.charAt(0) !== '~'
          && onlyFilename.charAt(0) !== '#'
          && onlyFilename.charAt(0) !== '.') {
          sources[parsedFileName] = content;
        }

        // increase files readFiles
        filesRead += 1;

        // process next file
        if (filesRead === files.length) {
          callback(null, sources);
        } else {
          next();
        }
      });
    }
  });
}

// is the contract abi a Test contract sol-test abi
function contractIsTest(contractABI) {
  let returnValue = false;

  // check method ABI
  contractABI.forEach((methodObject) => {
    // does it contain the method AssertTrueLog, if so, its a test
    if (methodObject.name === 'AssertEqLog') {
      returnValue = true;
    }
  });

  // return value
  return returnValue;
}

// sendTransaction successfull
// callback (error, bool)
function getTransactionSuccess(web3, hash, callback) {
  const receiptInterval = setInterval(() => {
    web3.eth.getTransactionReceipt(hash, (receiptError, receipt) => {
      if (receiptError) {
        clearInterval(receiptInterval);
        return callback(`while getting receipt for hash '${hash}: ${receiptError}'`, false);
      }

      // this is probably wrong
      if (receipt.blockHash !== '0x') {
        clearInterval(receiptInterval);
        return callback(null, receipt);
      }

      // return false
      return false;
    });
  }, 100);
}

// sort test method array
function compareABIByMethodName(methodObjectA, methodObjectB) {
  if (methodObjectA.name < methodObjectB.name) {
    return -1;
  }

  if (methodObjectA.name > methodObjectB.name) {
    return 1;
  }

  return 0;
}

function sortABIByMethodName(contractABI) {
  return contractABI.sort(compareABIByMethodName);
}

// error enhancement, more information about bad errors
function errorEnhancement(inputMessage) {
  var message = inputMessage; // eslint-disable-line
  var outputMessage = null; // eslint-disable-line

  // if the input message is an array or object
  if (inputMessage !== null
    && !isNaN(inputMessage)
    && typeof inputMessage !== 'string') {
    message = JSON.stringify(inputMessage);
  }

  // gauentee string convertion, null and other..
  message = String(message);

  // if message includes
  if (message.includes('Compiled contract not found')) {
    outputMessage = 'This could be due to a contract with the same name being compiled. Wafr doesnt allow two contracts with the same name. Look to see if any of your contracts have the same name.';
  }

  // if message includes
  if (message.includes('invalid JUMP')) {
    outputMessage = 'This can be caused by many things. One main cause is a `throw` flag being used somewhere in execution.';
  }

  // if message includes
  if (message.includes('invalid opcode') || message.includes('invalid op code')) {
    outputMessage = 'This can be caused by a contract which compiles fine, but doesnt execute properly in the Ethereum Virtual Machine. Such as using a `0x0` as an address.';
  }

  // if message includes
  if (message.includes('out of gas')) {
    outputMessage = `This error can be due to various scenarios:

    1. A error caused somewhere in your contract
    2. An error with the EVM module (npm: 'ethereumjs-vm')
    3. An error caused by the wafr module
    4. An error with the node simulation module (npm: 'ethereumjs-testrpc')
    5. A wafr account actually being out of gas

    If you cannot resolve this issue with reasonable investigation,
    report the error at:

    http://github.com/SilentCicero/wafr/issues

    If you believe the error is caused by the test node infrastructure,
    report the error at:

    http://github.com/ethereumjs/testrpc

    If you believe the error is caused by the EVM module, report the error
    at:

    http://github.com/ethereumjs/ethereumjs-vm
    `;
  }

  // return output message
  return outputMessage;
}

// normal terminal symbols
const symbols = {
  ok: '✓',
  err: '✖',
  dot: '․',
};

// With node.js on Windows: use symbols available in terminal default fonts
if (typeof process !== 'undefined') {
  if (process && process.platform === 'win32') {
    symbols.ok = '\u221A';
    symbols.err = '\u00D7';
    symbols.dot = '.';
  }
}

// increase the testrpc provider time by a specific amount, then mine
function increaseProviderTime(provider, time, callback) {
  if (typeof time !== 'number') {
    callback('error while increasing TestRPC provider time, time value must be a number.', null);
    return;
  }

  provider.sendAsync({
    method: 'evm_increaseTime',
    params: [time],
  }, (increaseTimeError) => {
    if (increaseTimeError) {
      callback(`error while increasing TestRPC provider time: ${JSON.stringify(increaseTimeError)}`, null);
    } else {
      provider.sendAsync({
        method: 'evm_mine',
      }, (mineError) => {
        if (mineError) {
          callback(`while mining block to increase time on TestRPC provider: ${JSON.stringify(mineError)}`, null);
        } else {
          callback(null, true);
        }
      });
    }
  });
}

// increase the TestRPC blocks by a specific count recursively
function increaseBlockRecursively(provider, count, total, callback) {
  // if the count hits the total, stop the recursion
  if (count >= total) {
    callback(null, true);
  } else {
    // else mine a block
    provider.sendAsync({
      method: 'evm_mine',
    }, (mineError) => {
      if (mineError) {
        callback(`while mining to increase block: ${JSON.stringify(mineError)}`, null);
      } else {
        increaseBlockRecursively(provider, count + 1, total, callback);
      }
    });
  }
}

// increase provider by block
function increaseProviderBlock(provider, blocks, callback) {
  increaseBlockRecursively(provider, 0, blocks, callback);
}

// get block increase value from method name
function getBlockIncreaseFromName(methodName) {
  const matchNumbers = String(methodName).match(/_increaseBlockBy(\d+)/);

  if (matchNumbers !== null
    && typeof matchNumbers[1] === 'string') {
    return parseInt(matchNumbers[1], 10);
  }

  return 0;
}

// get time increase value from method name
function getTimeIncreaseFromName(methodName) {
  const matchNumbers = String(methodName).match(/_increaseTimeBy(\d+)/);

  if (matchNumbers !== null
    && typeof matchNumbers[1] === 'string') {
    return parseInt(matchNumbers[1], 10);
  }

  return 0;
}

// export util modules
module.exports = {
  symbols,
  throwError,
  contractIsTest,
  getInputSources,
  getTestMethodsFromABI,
  report,
  log,
  bytes32ToType,
  filterTestsFromOutput,
  buildTestContractsArray,
  getTransactionSuccess,
  sortABIByMethodName,
  increaseProviderTime,
  errorEnhancement,
  increaseProviderBlock,
  filenameExtension,
  getTimeIncreaseFromName,
  getBlockIncreaseFromName,
};
