pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract AssertEqBytes32Test is Test {
  bytes32 value1;
  bytes32 value2;
  bytes32 value3;

  function setup() {
    value1 = bytes32(msg.sender);
    value2 = bytes32(address(this));
    value3 = bytes32(uint(92389489234692734827398));
  }

  function test_oneValidEqBytes32() {
    assertEq(value1, value1);
  }

  function test_oneValidEqBytes32Message() {
    assertEq(value2, value2, "value 2 should be value 2");
  }

  function test_twoValidEqBytes32() {
    assertEq(value1, value1, "value 1 should be value 1");
    assertEq(value3, value3, "some message");
  }

  function test_threeValidEqBytes32() {
    assertEq(value1, value1, "value 1 should be value 1");
    assertEq(value2, value2, "value 2 should be value 2");
    assertEq(value3, value3, "value 3 should be value 3");
  }

  function test_fourValidEqBytes32() {
    assertEq(value1, value1, "value 1 should be value 1");
    assertEq(value2, value2, "value 2 should be value 2");
    assertEq(value3, value3, "value 3 should be value 3");
    assertEq(bytes32(uint(23948423239)), bytes32(uint(23948423239)), "random value should be random value");
  }

  function test_oneInvalidEqBytes32() {
    assertEq(value2, value1);
  }

  function test_oneInvalidEqBytes32Message() {
    assertEq(value2, value1, "2 should not be 1");
  }

  function test_twoInvalidEqBytes32Message() {
    assertEq(value2, value1, "2 should not be 1");
    assertEq(value3, value1, "3 should not be 1");
  }

  function test_threeInvalidEqBytes32Message() {
    assertEq(value1, value2, "1 should not be 2");
    assertEq(value3, value1, "3 should not be 1");
    assertEq(value2, value3, "2 should not be 3");
  }

  function test_fourInvalidEqBytes32Message() {
    assertEq(value2, value3, "2 should not be 3");
    assertEq(bytes32(uint(3)), value1, "randon 3 should not be 1");
    assertEq(value2, value3, "2 should not be 3");
    assertEq(value2, bytes32(uint(3)), "2 should not be 3");
  }

  function test_mixValidEqBytes32Message() {
    assertEq(value2, value1, "2 should not be 1");
    assertEq(value2, value2, "2 should be 2");
    assertEq(value2, value3, "2 should not be 3");
    assertEq(bytes32(uint(3)), bytes32(uint(3)), "randon 3 should be randon 3");
    assertEq(value2, bytes32(uint(3)), "2 should not be 3");
  }
}
