/* eslint-disable */

var exec = require('child_process').exec;
exec('node -v', function (err, stdout, stderr) {
  if (err) throw err;
  if (parseFloat(String(stdout).slice(1)) < 6) {
    throw new Error('[wafr ERROR:] You need node version @>=6');
    process.exit(1);
  }
});
