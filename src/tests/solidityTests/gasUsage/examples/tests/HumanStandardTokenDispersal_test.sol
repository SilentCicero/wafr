pragma solidity ^0.4.4;

import "wafr/Test.sol";
import "examples/HumanStandardToken.sol";
import "examples/HumanStandardTokenDispersal.sol";

contract Dummy {}

contract HumanStandardTokenDispersalTest is Test {
  uint[] amounts;
  address[] accounts;

  function test_dispersal(){
    HumanStandardTokenDispersal dispersal = new HumanStandardTokenDispersal();
    amounts.push(uint(6));
    amounts.push(uint(6));
    amounts.push(uint(3));
    accounts.push(address(new Dummy()));
    accounts.push(address(new Dummy()));
    accounts.push(address(new Dummy()));
    address tokenAddr = dispersal.createHumanStandardToken(
        accounts,
        amounts,
        "ConsenSysNorthToken",
        7,
        "CNT");
    assertTrue(bool(tokenAddr != address(0)));
    HumanStandardToken token = HumanStandardToken(tokenAddr);
    assertEq(token.balanceOf(accounts[0]), 6);
    assertEq(token.balanceOf(accounts[1]), 6);
    assertEq(token.balanceOf(accounts[2]), 3);
  }
}
