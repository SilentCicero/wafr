const assert = require('chai').assert;
const wafr = require('../index.js');

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
        assert.equal(assertTrueSmallLogs.test_oneFalseAssert.logs[0].args._testValue, false); // eslint-disable-line

        assert.equal(typeof assertTrueSmallLogs.test_oneTrueAssert, 'object');
        assert.equal(assertTrueSmallLogs.test_oneTrueAssert.logs.length, 1);
        assert.equal(assertTrueSmallLogs.test_oneTrueAssert.logs[0].args._testValue, true); // eslint-disable-line


        const assertTrueLargeLogs = res.logs.AssertTrueLargeTest.logs;

        assert.equal(typeof assertTrueLargeLogs.test_threeTrueAssert, 'object');
        assert.equal(assertTrueLargeLogs.test_threeTrueAssert.logs.length, 3);
        assert.equal(assertTrueLargeLogs.test_threeTrueAssert.logs[0].args._testValue, true); // eslint-disable-line
        assert.equal(assertTrueLargeLogs.test_threeTrueAssert.logs[1].args._testValue, true); // eslint-disable-line
        assert.equal(assertTrueLargeLogs.test_threeTrueAssert.logs[2].args._testValue, true); // eslint-disable-line

        assert.equal(typeof assertTrueLargeLogs.test_oneTrueAssert, 'object');
        assert.equal(assertTrueLargeLogs.test_threeFalseAssert.logs.length, 3);
        assert.equal(assertTrueLargeLogs.test_threeFalseAssert.logs[0].args._testValue, false); // eslint-disable-line
        assert.equal(assertTrueLargeLogs.test_threeFalseAssert.logs[1].args._testValue, false); // eslint-disable-line
        assert.equal(assertTrueLargeLogs.test_threeFalseAssert.logs[2].args._testValue, false); // eslint-disable-line

        const assertTrueImportLogs = res.logs.AssertTrueImportTest.logs;

        assert.equal(typeof assertTrueImportLogs.test_oneFalseAssert, 'object');
        assert.equal(assertTrueImportLogs.test_oneFalseAssert.logs.length, 1);

        assert.equal(typeof assertTrueImportLogs.test_fiveAssertFalse, 'object');
        assert.equal(assertTrueImportLogs.test_fiveAssertFalse.logs.length, 5);
        assert.equal(assertTrueImportLogs.test_fiveAssertFalse.logs[2].args._testValue, false); // eslint-disable-line

        assert.equal(typeof assertTrueImportLogs.test_fiveAssertTrue, 'object');
        assert.equal(assertTrueImportLogs.test_fiveAssertTrue.logs.length, 5);
        assert.equal(assertTrueImportLogs.test_fiveAssertTrue.logs[2].args._testValue, true); // eslint-disable-line

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
        assert.equal(setupTestLogs.test_startBool.logs[0].args._testValue, true); // eslint-disable-line

        assert.equal(typeof setupTestLogs.test_startNumber, 'object');
        assert.equal(setupTestLogs.test_startNumber.logs.length, 1);
        assert.equal(setupTestLogs.test_startNumber.logs[0].args._testValue, true); // eslint-disable-line

        done();
      });
    });
  });
});
