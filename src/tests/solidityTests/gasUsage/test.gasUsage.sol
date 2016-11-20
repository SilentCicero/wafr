pragma solidity ^0.4.4;

import "wafr/Test.sol";
import "BoardRoom.sol";
import "examples/OpenRules.sol";

contract AssertUnlimitedGasUsageTest is Test {
  function deployBoard() returns (address) {
    OpenRules rules = new OpenRules();
    return address(new BoardRoom(address(rules)));
  }

  function test_1_assertGasUsage50Boards() {
    for (uint i = 0; i < 50; i++) {
      boardrooms[i] = deployBoard();
    }
  }

  function test_2_assertGasUsage100Boards() {
    for (uint i = 50; i < 150; i++) {
      boardrooms[i] = deployBoard();
    }
  }

  function test_3_assertGasUsage200Boards() {
    for (uint i = 150; i < 300; i++) {
      boardrooms[i] = deployBoard();
    }
  }

  function test_4_assertGasUsage700Boards() {
    for (uint i = 300; i < 700; i++) {
      boardrooms[i] = deployBoard();
    }
  }

  function test_5_assertGasUsage1400Boards() {
    for (uint i = 700; i < 1400; i++) {
      boardrooms[i] = deployBoard();
    }
  }

  function test_6_assertGasUsage2000Boards() {
    for (uint i = 1400; i < 2000; i++) {
      boardrooms[i] = deployBoard();
    }
  }

  function test_21_assertGasUsage50Boards() {
    for (uint i = 0; i < 50; i++) {
      boardrooms[i] = deployBoard();
    }
  }

  function test_22_assertGasUsage100Boards() {
    for (uint i = 50; i < 150; i++) {
      boardrooms[i] = deployBoard();
    }
  }

  function test_23_assertGasUsage200Boards() {
    for (uint i = 150; i < 300; i++) {
      boardrooms[i] = deployBoard();
    }
  }

  function test_24_assertGasUsage700Boards() {
    for (uint i = 300; i < 700; i++) {
      boardrooms[i] = deployBoard();
    }
  }

  function test_25_assertGasUsage1400Boards() {
    for (uint i = 700; i < 1400; i++) {
      boardrooms[i] = deployBoard();
    }
  }

  function test_26_assertGasUsage2000Boards() {
    for (uint i = 1400; i < 2000; i++) {
      boardrooms[i] = deployBoard();
    }
  }

  function test_31_assertGasUsage50Boards() {
    for (uint i = 0; i < 50; i++) {
      boardrooms[i] = deployBoard();
    }
  }

  function test_32_assertGasUsage100Boards() {
    for (uint i = 50; i < 150; i++) {
      boardrooms[i] = deployBoard();
    }
  }

  function test_33_assertGasUsage200Boards() {
    for (uint i = 150; i < 300; i++) {
      boardrooms[i] = deployBoard();
    }
  }

  function test_34_assertGasUsage700Boards() {
    for (uint i = 300; i < 700; i++) {
      boardrooms[i] = deployBoard();
    }
  }

  function test_35_assertGasUsage1400Boards() {
    for (uint i = 700; i < 1400; i++) {
      boardrooms[i] = deployBoard();
    }
  }

  function test_36_assertGasUsage2000Boards() {
    for (uint i = 1400; i < 2000; i++) {
      boardrooms[i] = deployBoard();
    }
  }
  mapping(uint => address) public boardrooms;
}
