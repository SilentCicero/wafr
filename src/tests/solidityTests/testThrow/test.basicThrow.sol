pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract BasicThrowTest is Test {
  uint startNumber;
  bool startBool;

  function setup() {
    startNumber = 5;
    startBool = true;
  }

  function test_startBool() {
    assertTrue(startBool, "start bool should be true");
  }

  function test_startNumber() {
    assertTrue(startNumber == 5, "start number should be 5");
  }

  function test_basicThrow() {
    throw;
  }

  function test_basicWithAssertBeforeThrow() {
    assertTrue(true, "should be true");
    throw;
  }

  function test_basicWithTwoAssertThrow() {
    assertTrue(true, "should be true");
    assertTrue(false, "should be false");
    throw;
  }

  function test_basicWithTwoAssertAfterThrow() {
    throw;
    assertTrue(true, "should be true");
    assertTrue(false, "should be false");
  }
}
