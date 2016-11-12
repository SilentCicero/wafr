pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract ValidTest1 is Test {
  function test_oneAssert() {
    assertTrue(false, "an assert");
  }
}

contract InvalidTest {
}

contract ValidTest2 is Test {
  function test_oneAssert() {
    assertTrue(false, "an assert");
  }
}
