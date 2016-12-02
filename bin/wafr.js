#!/usr/bin/env node

const meow = require('meow');
const path = require('path');
const fs = require('fs');
const utils = require('../src/utils/index.js');
const wafr = require('../src/index.js');

// handle cli
const cli = meow(`
    Usage
      $ wafr <path to contracts>

    Options
      --help           the help CLI
      --optimize -op   turn solc optimizer on or off
      --stats,   -s    output the stats report to a JSON file
      --output,  -o    solc compile output to a JSON file
      --version, -v    the package verson number

    Example
      $ wafr ./contracts --output ./build/contracts.json
`, {
  alias: {
    s: 'stats',
    o: 'output',
    op: 'optimize',
  },
});

// output path
const outputPath = cli.flags.output;
const statsPath = cli.flags.stats;
const solcOptimize = parseInt((cli.flags.optimize || 1), 10);

// write contracts file
function writeContractsFile(contractsFilePath, contractsObject, callback) { // eslint-disable-line
  if (typeof contractsFilePath !== 'string') {
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
  if (typeof statsFilePath !== 'string') {
    return callback();
  }

  if (utils.filenameExtension(statsFilePath) !== 'json') {
    throw new Error('Your stats output file must be a JSON file (i.e. --stats ./stats.json)');
  }

  fs.writeFile(path.resolve(statsFilePath), JSON.stringify(statsObject, null, 2), (writeStatsFileError) => {
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
wafr({ path: path.resolve(cli.input[0]), optimize: solcOptimize }, (wafrError, wafrResult) => {
  if (wafrError) {
    throw new Error(`error while running wafr CLI: ${wafrError}`);

    // exit badly
    process.exit(1); // eslint-disable-line
  } else {
    // if status failure
    if (wafrResult.status === 'failure') {
      writeStatsFile(statsPath, wafrResult, () => {
        process.exit(1);
      });
    } else {
      writeContractsFile(outputPath, utils.filterTestsFromOutput(wafrResult.contracts), () => {
        writeStatsFile(statsPath, wafrResult, () => {
          process.exit(0);
        });
      });
    }
  }
});
