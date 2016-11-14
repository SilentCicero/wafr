pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract DirDepthSecond2Test is Test {
  function test_oneValidAssertFalse() {
    assertFalse(false, "should be false");
  }
}
