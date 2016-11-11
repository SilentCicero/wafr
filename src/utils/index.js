const dir = require('node-dir');

// function to handle throwing an errorin sol-test
function throwError(error) {
  throw new Error(`[wafr] ERROR: ${error}`);
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
    if (typeof methodABI.name === 'string' &&
      methodABI.name.includes('test')) {
      testMethods.push(contractABI[methodIndex]);
    }
  });

  // return test methods
  return testMethods;
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

    // read all files
    dir.readFiles(dirname, (readFilesError, content, filename, next) => {
      if (readFilesError) {
        throwError(`while getting input sources ${readFilesError}`);
      }

      // parsed filename
      const parsedDirName = dirname.replace('./', '');
      const parsedFileName = filename.replace(parsedDirName, '').replace(/^\//, '');

      // add input sources to output
      if (filename.includes('.sol')) {
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
  });
}

// is the contract abi a Test contract sol-test abi
function contractIsTest(contractABI) {
  let returnValue = false;

  // check method ABI
  contractABI.forEach((methodObject) => {
    // does it contain the method AssertTrueLog, if so, its a test
    if (methodObject.name === 'AssertTrueLog') {
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
        return callback(null, true);
      }

      // return false
      return false;
    });
  }, 100);
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

// export util modules
module.exports = {
  symbols,
  throwError,
  contractIsTest,
  getInputSources,
  getTestMethodsFromABI,
  report,
  log,
  buildTestContractsArray,
  getTransactionSuccess,
};
