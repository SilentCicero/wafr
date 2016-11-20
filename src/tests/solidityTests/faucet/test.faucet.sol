pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract FaucetTestContract {
  function () payable {}
}

contract FaucetTest is Test {
  FaucetTestContract target;

  function setup() {
    target = new FaucetTestContract();
  }

  function test_contractBalance() {
    assertTrue(this.balance > 0, "balance greater than zero");
  }

  function test_sendFundsToContract() {
    assertTrue(target.balance == 0, "test contract balance should be zero");

    if (!target.send(1000)) {
      throw;
    }

    assertTrue(target.balance == 1000, "test contract balance should be 1000");
  }

  function test_oneFalseAssert() {
    assertTrue(false, "one false assert");
  }

  function test_oneTrueAssert() {
    assertTrue(true, "one true assert");
  }
}
