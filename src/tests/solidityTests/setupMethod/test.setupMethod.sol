pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract SetupTest is Test {
  uint startNumber;
  bool startBool;

  function test_startBool() {
    assertTrue(startBool, "start bool should be true");
  }

  function setup() {
    startNumber = 5;
    startBool = true;
  }

  function test_startNumber() {
    assertTrue(startNumber == 5, "start number should be 5");
  }
}
