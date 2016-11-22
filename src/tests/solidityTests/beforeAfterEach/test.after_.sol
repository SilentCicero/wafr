pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract AfterMethodTest is Test {
  uint someNumber = 0;
  uint anotherNumber = 0;

  function setup() {
    someNumber = 5;
    anotherNumber = 2;
  }

  function afterEach() {
    someNumber = 33;
  }

  function after_test_1_method() {
    anotherNumber = 4;
  }

  function test_1_method() {
    assertEq(someNumber, uint(5), "some number should be 5 from setup");
    assertEq(anotherNumber, uint(2), "another number should be 2 from setup");
  }

  function after_test_2_method() {
    someNumber = 6;
    anotherNumber = 4;
  }

  function test_2_method() {
    assertEq(someNumber, uint(33), "some number should be 2");
    assertEq(anotherNumber, uint(4), "another number should be 4 from after test 1");
  }

  function test_3_method() {
    assertEq(someNumber, uint(33), "some number should be 33");
    assertEq(anotherNumber, uint(4), "another number should be 4 from after test 2");
  }
}
