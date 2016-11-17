const assert = require('chai').assert;
const wafr = require('../index.js');
const bytes32True = '0x0000000000000000000000000000000000000000000000000000000000000001';
const bytes32False = '0x0000000000000000000000000000000000000000000000000000000000000000';

describe('run test ', () => {
  describe('assertTrue', () => {
    it('general assertTrue usage', (done) => {
      // run solTest
      wafr({
        path: './src/tests/solidityTests/assertTrue',
        root: './',
        optimize: 1,
      }, (err, res) => {
        assert.equal(err, null);
        assert.equal(typeof res, 'object');
        assert.equal(typeof res.logs, 'object');
        assert.equal(typeof res.logs.AssertTrueTest, 'object');
        assert.equal(typeof res.logs.AssertTrueLargeTest, 'object');
        assert.equal(typeof res.logs.AssertTrueSmallTest, 'object');
        assert.equal(typeof res.logs.AssertTrueImportTest, 'object');

        const assertTrueSmallLogs = res.logs.AssertTrueSmallTest.logs;

        assert.equal(typeof assertTrueSmallLogs.test_oneFalseAssert, 'object');
        assert.equal(assertTrueSmallLogs.test_oneFalseAssert.logs.length, 1);
        assert.equal(assertTrueSmallLogs.test_oneFalseAssert.logs[0].args._actualValue, bytes32False); // eslint-disable-line

        assert.equal(typeof assertTrueSmallLogs.test_oneTrueAssert, 'object');
        assert.equal(assertTrueSmallLogs.test_oneTrueAssert.logs.length, 1);
        assert.equal(assertTrueSmallLogs.test_oneTrueAssert.logs[0].args._actualValue, bytes32True); // eslint-disable-line


        const assertTrueLargeLogs = res.logs.AssertTrueLargeTest.logs;

        assert.equal(typeof assertTrueLargeLogs.test_threeTrueAssert, 'object');
        assert.equal(assertTrueLargeLogs.test_threeTrueAssert.logs.length, 3);
        assert.equal(assertTrueLargeLogs.test_threeTrueAssert.logs[0].args._actualValue, bytes32True); // eslint-disable-line
        assert.equal(assertTrueLargeLogs.test_threeTrueAssert.logs[1].args._actualValue, bytes32True); // eslint-disable-line
        assert.equal(assertTrueLargeLogs.test_threeTrueAssert.logs[2].args._actualValue, bytes32True); // eslint-disable-line

        assert.equal(typeof assertTrueLargeLogs.test_oneTrueAssert, 'object');
        assert.equal(assertTrueLargeLogs.test_threeFalseAssert.logs.length, 3);
        assert.equal(assertTrueLargeLogs.test_threeFalseAssert.logs[0].args._actualValue, bytes32False); // eslint-disable-line
        assert.equal(assertTrueLargeLogs.test_threeFalseAssert.logs[1].args._actualValue, bytes32False); // eslint-disable-line
        assert.equal(assertTrueLargeLogs.test_threeFalseAssert.logs[2].args._actualValue, bytes32False); // eslint-disable-line

        const assertTrueImportLogs = res.logs.AssertTrueImportTest.logs;

        assert.equal(typeof assertTrueImportLogs.test_oneFalseAssert, 'object');
        assert.equal(assertTrueImportLogs.test_oneFalseAssert.logs.length, 1);

        assert.equal(typeof assertTrueImportLogs.test_fiveAssertFalse, 'object');
        assert.equal(assertTrueImportLogs.test_fiveAssertFalse.logs.length, 5);
        assert.equal(assertTrueImportLogs.test_fiveAssertFalse.logs[2].args._actualValue, bytes32False); // eslint-disable-line

        assert.equal(typeof assertTrueImportLogs.test_fiveAssertTrue, 'object');
        assert.equal(assertTrueImportLogs.test_fiveAssertTrue.logs.length, 5);
        assert.equal(assertTrueImportLogs.test_fiveAssertTrue.logs[2].args._actualValue, bytes32True); // eslint-disable-line

        const assertTrueLogs = res.logs.AssertTrueTest.logs;

        assert.equal(typeof assertTrueLogs.test_oneFalseAssert, 'object');
        assert.equal(assertTrueLogs.test_oneFalseAssert.logs.length, 1);

        assert.equal(typeof assertTrueLogs.test_oneTrueAssert, 'object');
        assert.equal(assertTrueLogs.test_oneTrueAssert.logs.length, 1);

        assert.equal(typeof assertTrueLogs.test_twoFalseAsserts, 'object');
        assert.equal(assertTrueLogs.test_twoFalseAsserts.logs.length, 2);

        assert.equal(typeof assertTrueLogs.test_twoTrueAsserts, 'object');
        assert.equal(assertTrueLogs.test_twoTrueAsserts.logs.length, 2);

        assert.equal(typeof assertTrueLogs.test_oneTrueAndFalseAssert, 'object');
        assert.equal(assertTrueLogs.test_oneTrueAndFalseAssert.logs.length, 2);
        done();
      });
    });

    it('should run basic throw tests without stopping', (done) => {
      // run solTest
      wafr({
        path: './src/tests/solidityTests/testThrow',
        root: './',
        optimize: 1,
      }, (err, res) => {
        assert.equal(err, null);
        assert.equal(typeof res, 'object');
        assert.equal(res.logs.BasicThrowTest.name, 'BasicThrowTest');
        assert.equal(res.logs.BasicThrowTest.index, 0);
        assert.equal(typeof res.logs.BasicThrowTest.logs.test_basicThrow, 'object');
        assert.equal(typeof res.logs.BasicThrowTest.logs.test_basicWithAssertBeforeThrow, 'object');
        done();
      });
    });

    it('should compile campaign contracts and run large test', (done) => {
      // run solTest
      wafr({
        path: './src/tests/solidityTests/campaign',
        optimize: 1,
      }, (wafrError, res) => {
        assert.equal(wafrError, null);
        assert.equal(typeof res, 'object');
        done();
      });
    });

    it('should compile contract dir test and import depth', (done) => {
      // run solTest
      wafr({
        path: './src/tests/solidityTests/dirDepth',
        optimize: 1,
      }, (wafrError, res) => {
        assert.equal(wafrError, null);
        assert.equal(typeof res, 'object');
        done();
      });
    });

    it('assertFalse should function properly', (done) => {
      // run solTest
      wafr({
        path: './src/tests/solidityTests/assertFalse',
        optimize: 1,
      }, (wafrError, res) => {
        assert.equal(wafrError, null);
        assert.equal(typeof res, 'object');
        done();
      });
    });

    it('assertEq should function properly', (done) => {
      // run solTest
      wafr({
        path: './src/tests/solidityTests/assertEq',
        optimize: 1,
      }, (wafrError, res) => {
        assert.equal(wafrError, null);
        assert.equal(typeof res, 'object');

        // bytes 32 tests
        assert.equal(res.logs.AssertEqBytes32Test.logs.test_oneValidEqBytes32.status, 'success');
        assert.equal(res.logs.AssertEqBytes32Test.logs.test_oneInvalidEqBytes32Message.status, 'failure');
        assert.equal(res.logs.AssertEqBytes32Test.logs.test_twoInvalidEqBytes32Message.status, 'failure');
        assert.equal(res.logs.AssertEqBytes32Test.logs.test_threeInvalidEqBytes32Message.status, 'failure');
        assert.equal(res.logs.AssertEqBytes32Test.logs.test_oneInvalidEqBytes32Message.status, 'failure');
        assert.equal(res.logs.AssertEqBytes32Test.logs.test_twoInvalidEqBytes32Message.status, 'failure');
        assert.equal(res.logs.AssertEqBytes32Test.logs.test_threeInvalidEqBytes32Message.status, 'failure');
        assert.equal(res.logs.AssertEqBytes32Test.logs.test_fourInvalidEqBytes32Message.status, 'failure');
        assert.equal(res.logs.AssertEqBytes32Test.logs.test_mixValidEqBytes32Message.status, 'failure');

        // uint tests
        assert.equal(res.logs.AssertEqUintTest.logs.test_oneValidEqUint1.status, 'success');
        assert.equal(res.logs.AssertEqUintTest.logs.test_oneValidEqUint2.status, 'success');
        assert.equal(res.logs.AssertEqUintTest.logs.test_oneValidEqUint3.status, 'success');
        assert.equal(res.logs.AssertEqUintTest.logs.test_validEmptyEqEmpty.status, 'success');

        // address tests
        assert.equal(res.logs.AssertEqAddressTest.logs.test_oneValidEqAddress.status, 'success');
        assert.equal(res.logs.AssertEqAddressTest.logs.test_oneInvalidEmptyAddress.status, 'failure');
        assert.equal(res.logs.AssertEqAddressTest.logs.test_messageSenderEq.status, 'success');
        assert.equal(res.logs.AssertEqAddressTest.logs.test_twoValidAndInvalidEqAddress.status, 'failure');
        done();
      });
    });

    it('should run through empty tests, and skip bad contracts', (done) => {
      // run solTest
      wafr({
        path: './src/tests/solidityTests/emptyTestContract',
        optimize: 1,
      }, (wafrError, res) => {
        assert.equal(wafrError, null);
        assert.equal(typeof res, 'object');
        assert.equal(res.logs.ValidTest1.logs.test_oneAssert.logs.length, 1);
        assert.equal(res.logs.ValidTest2.logs.test_oneAssert.logs.length, 1);
        done();
      });
    });

    it('increase block feature should function', (done) => {
      // run solTest
      wafr({
        path: './src/tests/solidityTests/increaseBlockBy',
        optimize: 1,
      }, (wafrError, res) => {
        assert.equal(wafrError, null);
        assert.equal(typeof res, 'object');
        assert.equal(res.logs.IncreaseBlockTest.logs.test_increaseBlockBy5000.logs.length, 1);
        assert.equal(res.logs.IncreaseBlockTest.logs.test_increaseBlockBy5000.logs[0].args._actualValue, bytes32True); // eslint-disable-line
        assert.equal(res.logs.IncreaseBlockTest.logs.test_someOtherFalseTest.status, 'failure');
        assert.equal(res.logs.IncreaseBlockTest.logs.test_increaseBlockNumber30211.status, 'success');
        assert.equal(res.logs.IncreaseBlockTest.logs.test_startBlock.status, 'success');
        assert.equal(res.logs.IncreaseBlockTest.logs.test_someTest.status, 'success');
        done();
      });
    });

    it('increase time feature should function', (done) => {
      // run solTest
      wafr({
        path: './src/tests/solidityTests/increaseTimeBy',
        optimize: 1,
      }, (wafrError, res) => {
        assert.equal(wafrError, null);
        assert.equal(typeof res, 'object');
        assert.equal(res.logs.IncreaseTimeTest.logs.test_expiry_increaseTimeBy30000.logs.length, 2);
        assert.equal(res.logs.IncreaseTimeTest.logs.test_expiry_increaseTimeBy30000.logs[0].args._actualValue, bytes32True); // eslint-disable-line
        assert.equal(res.logs.IncreaseTimeTest.logs.test_expiry_increaseTimeBy30000.status, 'success');
        assert.equal(res.logs.IncreaseTimeTest.logs.test_increaseTimeBy800000_timecheck.status, 'success');
        assert.equal(res.logs.IncreaseTimeTest.logs.test_someOtherTest.status, 'success');
        assert.equal(res.logs.IncreaseTimeTest.logs.test_someTest.status, 'success');
        done();
      });
    });

    it('no tests dir', (done) => {
      // run solTest
      wafr({
        path: './src/tests/solidityTests/noTestDir',
        optimize: 1,
      }, (wafrError, res) => {
        assert.equal(wafrError, null);
        assert.equal(typeof res, 'object');
        assert.equal(Object.keys(res.logs).length, 0);
        done();
      });
    });

    it('should run balance faucet tests', (done) => {
      // run solTest
      wafr({
        path: './src/tests/solidityTests/faucet',
        optimize: 1,
      }, (wafrError, res) => {
        assert.equal(wafrError, null);
        assert.equal(typeof res, 'object');
        assert.equal(res.logs.FaucetTest.name, 'FaucetTest');
        assert.equal(typeof res.logs.FaucetTest.logs.test_contractBalance, 'object');
        assert.equal(res.logs.FaucetTest.logs.test_contractBalance.logs[0].args._actualValue, bytes32True); // eslint-disable-line
        assert.equal(typeof res.logs.FaucetTest.logs.test_sendFundsToContract, 'object');
        assert.equal(res.logs.FaucetTest.logs.test_sendFundsToContract.logs.length, 2);
        assert.equal(res.logs.FaucetTest.logs.test_sendFundsToContract.logs[0].args._actualValue, bytes32True); // eslint-disable-line
        assert.equal(res.logs.FaucetTest.logs.test_sendFundsToContract.logs[0].args._actualValue, bytes32True); // eslint-disable-line
        assert.equal(res.logs.FaucetTest.logs.test_contractBalance.status, 'success');
        assert.equal(res.logs.FaucetTest.logs.test_contractBalance.status, 'success');
        assert.equal(res.logs.FaucetTest.logs.test_oneFalseAssert.status, 'failure');
        done();
      });
    });

    it('should run BoardRoom tests', (done) => {
      // run solTest
      wafr({
        path: './src/tests/solidityTests/boardroom',
        root: './',
        optimize: 1,
      }, (wafrError, res) => {
        assert.equal(wafrError, null);
        assert.equal(typeof res, 'object');
        assert.equal(res.logs.AssertTrueBoardRoomTest.name, 'AssertTrueBoardRoomTest');
        assert.equal(res.logs.AssertTrueBoardRoomTest.index, 0);
        assert.equal(typeof res.logs.AssertTrueBoardRoomTest.logs.test_setupBoardRoomAndAssert, 'object');
        done();
      });
    });

    it('should run setup method before all other tests', (done) => {
      // run solTest
      wafr({
        path: './src/tests/solidityTests/setupMethod',
        root: './',
        optimize: 1,
      }, (err, res) => {
        assert.equal(err, null);
        assert.equal(typeof res, 'object');

        assert.equal(err, null);
        assert.equal(typeof res, 'object');
        assert.equal(typeof res.logs.SetupTest, 'object');

        const setupTestLogs = res.logs.SetupTest.logs;

        assert.equal(typeof setupTestLogs.test_startBool, 'object');
        assert.equal(setupTestLogs.test_startBool.logs.length, 1);
        assert.equal(setupTestLogs.test_startBool.logs[0].args._actualValue, bytes32True); // eslint-disable-line

        assert.equal(typeof setupTestLogs.test_startNumber, 'object');
        assert.equal(setupTestLogs.test_startNumber.logs.length, 1);
        assert.equal(setupTestLogs.test_startNumber.logs[0].args._actualValue, bytes32True); // eslint-disable-line

        done();
      });
    });
  });
});
