pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract TestLogs is Test {
  function test_logs() {
    log_uint(uint(49999), "some message");
  }
}
