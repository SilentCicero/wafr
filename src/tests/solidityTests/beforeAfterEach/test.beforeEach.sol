pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract BeforeEachTest is Test {
  uint someNumber = 0;

  function setup() {
    someNumber = 5;
  }

  function beforeEach() {
    someNumber = 3;
  }

  function test_validShouldThrow() {
    throw;
  }

  function test_validShouldBe3() {
    assertEq(someNumber, uint(3), "should be 3");
    someNumber = 5;
  }

  function test_validShouldBe3_2() {
    assertEq(someNumber, uint(3), "should still be 3");
    someNumber = 7;
  }

  function test_validShouldBe3_increaseBlocksBy100() {
    assertEq(someNumber, uint(3), "should still be 3");
    someNumber = 99;
  }

  function test_validShouldBe3_increaseTimeBy30000() {
    assertEq(uint(3), someNumber, "should still be 3");
    someNumber = 100;
  }
}
