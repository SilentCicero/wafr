pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract AssertEqUintTest is Test {
  uint value1;
  uint value2;
  uint value3;

  function setup() {
    value1 = 45;
    value2 = 374009283;
    value3 = uint256(3847);
  }

  function test_oneValidEqUint1() {
    assertEq(value1, uint(45), "value1 should be 45");
  }

  function test_oneValidEqUint2() {
    assertEq(uint(374009283), value2, "value1 should be 374009283");
  }

  function test_oneValidEqUint3() {
    assertEq(value3, uint(3847));
  }

  function test_validEmptyEqEmpty() {
    assertEq(uint(0), uint(0), "zero should be zero");
  }

  function test_validEmptyEqEmpty256() {
    assertEq(uint256(0), uint256(0), "zero 256 should be zero");
  }

  function test_invalidEmptyNotOne() {
    assertEq(uint256(0), uint256(1), "zero should not equal one");
  }

  function test_invalidEmptyEqVal() {
    assertEq(uint256(0), value1, "zero should not equal value 1");
  }

  function testThrow_invalidZeroValue1() {
    if (uint256(0) == value1) {
      throw;
    }
  }

  function test_invalidAddressNotZero() {
    assertEq(uint(address(this)), value1, "address should not equal value 1");
  }

  function test_invalidEmptyEqVal1() {
    assertEq(value1, uint(0), "value 1 should not equal zero");
  }

  function test_invalidValue1EqValue2() {
    assertEq(value1, value2, "value 1 should not equal value 2");
  }

  function test_invalidBalanceNotZero() {
    assertEq(this.balance, 0, "contract balance should not equal zero");
  }

  function test_twoValidEqUint() {
    assertEq(value1, value1, "value 1 should be value 1");
    assertEq(value2, uint(374009283), "value 2 should be value 2");
  }

  function test_validContractBalance() {
    assertEq(this.balance, this.balance, "contract balance should be contract balance");
  }

  function test_twoValidEqUint2() {
    assertEq(uint256(3847), value3, "value 3 should be value 3");
    assertEq(value2, value2, "value 2 should be value 2");
  }

  function test_threeInvalidEqUint() {
    assertEq(uint256(3847), value1, "value 3 should not be value 1");
    assertEq(value2, value3, "value 2 should not be value 3");
    assertEq(value2, value1, "value 2 should not be value 1");
  }

  function test_threeValidEqUint() {
    assertEq(uint256(3847), value3, "value 3 should be value 3");
    assertEq(value2, value2, "value 2 should be value 2");
    assertEq(value1, value1, "value 1 should be value 1");
  }

  function test_fourInvalidEqUint() {
    assertEq(uint(0), value3, "zero should not be value 3");
    assertEq(uint256(3847), value2, "value 3 should not be value 2");
    assertEq(value1, value2, "value 1 should not be value 2");
    assertEq(value2, value3, "value 2 should not be value 3");
  }

  function test_fourValidEqUint() {
    assertEq(uint(0), uint(0), "zero should be zero");
    assertEq(uint256(3847), value3, "value 3 should be value 3");
    assertEq(value2, value2, "value 2 should be value 2");
    assertEq(value1, value1, "value 1 should be value 1");
  }
}
