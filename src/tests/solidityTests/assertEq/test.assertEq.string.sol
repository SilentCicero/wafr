pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract AssertEqStringTest is Test {
  string value1 = "0000x0000fdkjsdkj98393fjsk";
  string value2;
  string value3 = "fdkjfdsjkdfs";
  string value4;

  function setup() {
    value2 = "0x07dad76ee284f082504ba79ad924f256";
    value4 = "0x098ed2db2c63b3f75de6bb7ce74273c093159122a8da4";
  }

  function test_oneValidEqString() {
    assertEq(value2, value2, "value2 should be 2");
  }

  function test_oneInvalidEqString() {
    assertEq(value2, value4, "value2 should not be 4");
  }

  function test_oneInvalidEqString2() {
    assertEq(value3, value1, "value3 should not be 1");
  }

  function test_threeValidEqString() {
    assertEq(value3, value3, "3 should be 3");
    assertEq(value2, value2, "2 should be 2");
    assertEq(value1, value1, "one should be one");
  }

  function test_twoValidEqString() {
    assertEq(value3, value3);
    assertEq(value2, value2);
  }

  function test_oneValidEqStringNoLog() {
    assertEq(value3, value3);
  }

  function test_threeInvalidEqString() {
    assertEq(value4, value4, "value3 should not be 4");
    assertEq(value2, value4, "value2 should not be 4");
    assertEq(value3, value1, "value3 should not be 1");
  }

  function test_twoInvalidEqString() {
    assertEq(value2, value4, "value2 should not be 4");
    assertEq(value3, value1, "value3 should not be 1");
  }
}
