#!/usr/bin/env node

const meow = require('meow');
const path = require('path');
const fs = require('fs');
const utils = require('../src/utils/index.js');
const wafr = require('../src/index.js');

// handle cli
const cli = meow(`
    Usage
      $ wafr <path to contract test>

    Options
      --help         the help CLI
      --stats,   -s  output the stats report to a JSON file
      --output,  -o  solc compile output to a JSON file
      --version, -v  the package verson number

    Examples
      $ wafr ./contracts --output ./build/contracts.json
`, {
  alias: {
    s: 'stats',
    o: 'output',
  },
});

// output path
const outputPath = cli.flags.output;
const statsPath = cli.flags.stats;

// write contracts file
function writeContractsFile(contractsFilePath, contractsObject, callback) { // eslint-disable-line
  if (typeof contractsFilePath === 'undefined') {
    return callback();
  }

  if (utils.filenameExtension(contractsFilePath) !== 'json') {
    throw new Error('Your contracts output file must be a JSON file (i.e. --output ./contracts.json)');
  }

  fs.writeFile(path.resolve(contractsFilePath), JSON.stringify(contractsObject), (writeContractsFileError) => {
    if (writeContractsFileError) {
      throw new Error(`while writting output JSON file ${contractsFilePath}: ${writeContractsFileError}`);
    }

    callback();
  });
}

// write stats file
function writeStatsFile(statsFilePath, statsObject, callback) { // eslint-disable-line
  if (typeof statsFilePath === 'undefined') {
    return callback();
  }

  if (utils.filenameExtension(statsFilePath) !== 'json') {
    throw new Error('Your stats output file must be a JSON file (i.e. --stats ./stats.json)');
  }

  fs.writeFile(path.resolve(statsFilePath), JSON.stringify(statsObject), (writeStatsFileError) => {
    if (writeStatsFileError) {
      throw new Error(`while writting stats JSON file ${statsFilePath}: ${writeStatsFileError}`);
    }

    callback();
  });
}

if (typeof cli.input[0] === 'undefined') {
  cli.showHelp();
}

// the main wafr code to run
wafr({ path: path.resolve(cli.input[0]), optimize: 1 }, (wafrError, wafrResult) => {
  if (wafrError) {
    throw new Error(`error while running wafr CLI: ${wafrError}`);

    // exit badly
    process.exit(1); // eslint-disable-line
  } else {
    // if status failure
    if (wafrResult.status === 'failure') {
      process.exit(1);
    } else {
      // if there is an output path, build sources
      /* if (typeof outputPath !== 'undefined') {
        fs.writeFile(path.resolve(outputPath), JSON.stringify(utils.filterTestsFromOutput(wafrResult.contracts)), (writeFileError) => {
          if (writeFileError) {
            throw new Error(`while writting output JSON file ${outputPath}: ${writeFileError}`);
          }

          process.exit(0);
        });
      } else {
        process.exit(0);
      }
      */

      writeContractsFile(outputPath, utils.filterTestsFromOutput(wafrResult.contracts), () => {
        writeStatsFile(statsPath, wafrResult, () => {
          process.exit(0);
        });
      });
    }
  }
});
