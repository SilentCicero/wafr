pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract AssertEqBytesTest is Test {
  bytes value1 = "0000x0000fdkjsdkj98393fjsk";
  bytes value2;
  bytes value3 = "fdkjfdsjkdfs";
  bytes value4;

  function setup() {
    value2 = "0x07dad76ee284f082504ba79ad924f256";
    value4 = "0x098ed2db2c63b3f75de6bb7ce74273c093159122a8da4";
  }

  function test_oneValidEqBytes() {
    assertEq(value2, value2, "value2 should be 2");
  }

  function test_oneInvalidEqBytes() {
    assertEq(value2, value4, "value2 should not be 4");
  }

  function test_oneInvalidEqBytes2() {
    assertEq(value3, value1, "value3 should not be 1");
  }

  function test_threeValidEqBytes() {
    assertEq(value3, value3, "3 should be 3");
    assertEq(value2, value2, "2 should be 2");
    assertEq(value1, value1, "one should be one");
  }

  function test_twoValidEqBytes() {
    assertEq(value3, value3);
    assertEq(value2, value2);
  }

  function test_oneValidEqBytesNoLog() {
    assertEq(value3, value3);
  }

  function test_threeInvalidEqBytes() {
    assertEq(value4, value4, "value3 should not be 4");
    assertEq(value2, value4, "value2 should not be 4");
    assertEq(value3, value1, "value3 should not be 1");
  }

  function test_twoInvalidEqBytes() {
    assertEq(value2, value4, "value2 should not be 4");
    assertEq(value3, value1, "value3 should not be 1");
  }

}
