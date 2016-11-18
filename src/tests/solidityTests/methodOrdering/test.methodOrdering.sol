pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract MethodOrderingByNumberTest is Test {
  function test_3_someTest() {
  }

  function test_1_someTest() {
  }

  function test_4_someTest() {
  }

  function test_2_someTest() {
  }

  function test_chain2_3() {
    assertTrue(true, "should be test 3");
  }

  function test_chain2_2_increaseBlocksBy5() {
    assertTrue(true, "should be test 2");
  }

  function test_chain2_1_increaseTimeBy5000() {
    assertTrue(true, "should be test 1");
  }

  function test_chain2_4() {
    assertTrue(true, "should be test 4");
  }
}
