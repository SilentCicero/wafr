pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract BeforeMethodTest is Test {
  uint someNumber = 0;

  function setup() {
    someNumber = 5;
  }

  function beforeEach() {
    someNumber = 3;
  }

  function before_test_method() {
    someNumber = 7;
  }

  function test_method() {
    assertEq(someNumber, uint(7), "some number should be 7");
  }

  function before_test_method_increaseTimeBy30000() {
    someNumber = 99;
  }

  function test_method_increaseTimeBy30000() {
    assertEq(someNumber, uint(99), "some number should be 99");
  }
}
