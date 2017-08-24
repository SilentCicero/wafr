pragma solidity ^0.4.15;

import "wafr/Test.sol";
import "something.sol";
import "anotherThing.sol";

contract SomethingTest is Test {
  function test_1() {
    assertEq(uint(1), uint(1), "test");
  }
}
