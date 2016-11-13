pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract IncreaseTimeTest is Test {
  uint expiry;
  uint timecheck;

  function setup() {
    expiry = now;
    timecheck = now;
  }

  function test_someOtherTest() {
    assertTrue(now > 0, "now is greater than zero");
  }

  function test_expiry_increaseTimeBy30000() {
    assertTrue(now > expiry, "now should be greater than the setup expiry");
    assertTrue((now - expiry) >= 30000, "expiry - now = greater than 30000");
  }

  function test_someTest() {
    assertTrue(expiry > 0, "expry should be greater than zero");
  }

  function test_increaseTimeBy800000_timecheck() {
    assertTrue((now - timecheck) >= 800000, "timecheck - now >= 800000");
  }
}
