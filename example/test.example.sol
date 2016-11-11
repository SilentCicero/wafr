pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract MyTest is Test {
  uint firstNumber;
  uint secondNumber;

  function setup() {
    firstNumber = 1;
    secondNumber = 2;
  }

  function test_basicUnitTest() {
    assertTrue(firstNumber != secondNumber, "first number should not equal second number");
  }

  function test_BasicThrow() {
    if (firstNumber != secondNumber) {
      throw;
    }
  }
}
