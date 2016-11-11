pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract AssertTrueSmallTest is Test {
  function test_oneFalseAssert() {
    assertTrue(false, "one false assert");
  }

  function test_oneTrueAssert() {
    assertTrue(true, "one true assert");
  }

  function test_oneTrueAndFalseAssert() {
    assertTrue(true, "one true assert");
    assertTrue(false, "one false asserts");
  }
}
