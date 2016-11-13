pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract IncreaseBlockTest is Test {
  uint startBlock;

  function setup() {
    startBlock = block.number;
  }

  function test_startBlock() {
    assertTrue(startBlock > 0, "start block is greater than zero");
  }

  function test_someTest() {
    assertTrue(true, 'some test');
  }

  function test_increaseBlockBy5000() {
    assertTrue((block.number - startBlock) > 5000, "block number - start block > 5000 blocks ahead");
  }

  function test_someOtherFalseTest() {
    assertTrue(false, "a false test");
  }

  function test_increaseBlockNumber30211() {
    assertTrue(true, "big block increase");
  }
}
