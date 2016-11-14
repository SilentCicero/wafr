pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract AssertEqBoolTest is Test {
  bool trueValue;
  bool falseValue;

  function setup() {
    trueValue = true;
    falseValue = false;
  }

  function test_oneValidEqBool() {
    assertEq(true, true, "true should be true");
  }

  function test_falseEqNoLog() {
    assertEq(falseValue, false);
  }

  function test_twoValidEqBool() {
    assertEq(true, trueValue, "true should be true");
    assertEq(false, false, "false should be false");
  }

  function test_threeValidEqBool() {
    assertEq(true, true, "true should be true");
    assertEq(falseValue, false, "false should be false");
    assertEq(false, false, "false should be false");
  }

  function test_fourValidEqBool() {
    assertEq(true, true, "true should be true");
    assertEq(false, false);
    assertEq(false, falseValue, "false should be false");
    assertEq(true, trueValue);
  }

  function test_oneInvalidFalseEq() {
    assertEq(true, false);
  }

  function test_oneInvalidFalseEqLog() {
    assertEq(true, false, "true should not be false");
  }

  function test_twoInvalidFalseEqLog() {
    assertEq(true, false, "true should not be false");
    assertEq(false, true, "false should not be true");
  }

  function test_threeInvalidFalseEqLog() {
    assertEq(true, false, "true should not be false");
    assertEq(false, true, "false should not be true");
    assertEq(true, falseValue, "true should not be false");
  }

  function test_fourInvalidFalseEqLog() {
    assertEq(trueValue, false, "true should not be false");
    assertEq(false, true, "false should not be true");
    assertEq(true, falseValue, "true should not be false");
  }

  function test_withAssertTrue() {
    assertTrue(trueValue, "true should be true");
    assertEq(false, true, "false should not be true");
  }
}
