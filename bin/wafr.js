#!/usr/bin/env node

const meow = require('meow');
const path = require('path');
const wafr = require('../src/index.js');

// handle cli
const cli = meow(`
    Usage
      $ wafr <path to contract test>
`);

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
      process.exit(0);
    }
  }
});
