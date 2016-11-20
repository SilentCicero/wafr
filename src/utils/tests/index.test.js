const assert = require('chai').assert;
const util = require('../index.js');
const bytes32ToType = util.bytes32ToType;
const bytes32BoolTrue = '0x0000000000000000000000000000000000000000000000000000000000000001';
const bytes32BoolFalse = '0x0000000000000000000000000000000000000000000000000000000000000000';
const bytes32UintValue2 = '0x00000000000000000000000000000000000000000000000000000000164aedc3';
const bytes32UintValue3 = '0x0000000000000000000000000000000000000000000000000000000000000000';
const bytes32UintValue1 = '0x0000000000000000000000000000000000000000000000000000000000000001';
const bytes32UintValue4 = '0x000000000000000000000000000000000000000000000000000000000000002d';
const bytes32UintValue6 = '0x0000000000000000000000000000000000000000000000000000000000000f07';
const bytes32IntValue1 = '0x000000000000000000000000000000000000000000000000000000000000002d';
const bytes32IntValue2 = '0x00000000000000000000000000000000000000000000000000000000164aedc3';
const bytes32IntValue3 = '0x0000000000000000000000000000000000000000000000000000000000000f07';

const bytes32IntLarge1 = '0x0000000000000000000000000000000000000000000000007FFFFFFFFFFFFFFF';
const intLarge1 = '9223372036854775807';

const bytes32Address1 = '0x000000000000000000000000842d244efb00696419279d3eb9c881cf849fcd3a';
const address1 = '0x842d244efb00696419279d3eb9c881cf849fcd3a';

const bytes32Address2 = '0x0000000000000000000000000000000000000000000000000000000000000000';
const address2 = '0x0000000000000000000000000000000000000000';

describe('test wafr utils', () => {
  describe('bytes32ToType', () => {
    it('should convert bytes32 values to types', () => {
      assert.equal(bytes32ToType('bool', bytes32BoolTrue), true);
      assert.equal(bytes32ToType('bool', bytes32BoolFalse), false);
      assert.equal(bytes32ToType('address', bytes32BoolFalse), false);
      assert.equal(bytes32ToType('uint', bytes32UintValue2), 374009283);
      assert.equal(bytes32ToType('uint', bytes32UintValue3), 0);
      assert.equal(bytes32ToType('uint', bytes32UintValue1), 1);
      assert.equal(bytes32ToType('uint', bytes32UintValue4), 45);
      assert.equal(bytes32ToType('uint', bytes32UintValue6), 3847);
      assert.equal(bytes32ToType('int', bytes32IntValue1), 45);
      assert.equal(bytes32ToType('int', bytes32IntValue2), 374009283);
      assert.equal(bytes32ToType('int', bytes32IntValue3), 3847);
      assert.equal(bytes32ToType('int', bytes32IntLarge1), intLarge1);
      assert.equal(bytes32ToType('string', bytes32BoolTrue), bytes32BoolTrue);
      assert.equal(bytes32ToType('bytes', bytes32BoolFalse), bytes32BoolFalse);
      assert.equal(bytes32ToType('address', bytes32Address1), address1);
      assert.equal(bytes32ToType('address', bytes32Address2), address2);
    });
  });
});
