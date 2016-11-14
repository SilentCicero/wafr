pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract AssertFalseTest is Test {
  function test_oneValidAssertFalse() {
    assertFalse(false, "should be false");
  }

  function test_twoValidAssertFalse() {
    assertFalse(false, "should be false");
    assertFalse(uint(0) == uint(2), "zero shouldnt be 2");
  }

  function test_threeValidAssertFalse() {
    assertFalse(false, "should be false");
    assertFalse(uint(0) == uint(2), "zero shouldnt be 2");
  }

  function test_oneTrueFalse() {
    assertFalse(true, "should be true");
    assertFalse(false, "should be false");
  }

  function test_oneInvalidAssertFalse() {
    assertFalse(true, "should be true");
  }

  function test_twoInvalidAssertFalse() {
    assertFalse(true, "should be false");
    assertFalse(uint(0) != uint(4), "zero shouldnt be 4");
  }

  function test_threeInvalidAssertFalse() {
    assertFalse(true, "should not be false");
    assertFalse(uint(0) != uint(2), "zero should be 2");
  }
}
