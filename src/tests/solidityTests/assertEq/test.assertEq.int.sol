pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract AssertEqIntTest is Test {
  int value1;
  int value2;
  int value3;

  function setup() {
    value1 = 45;
    value2 = 374009283;
    value3 = int256(3847);
  }

  function test_oneValidEqInt1() {
    assertEq(value1, int(45), "value1 should be 45");
  }

  function test_oneValidEqInt2() {
    assertEq(int(374009283), value2, "value1 should be 374009283");
  }

  function test_oneValidEqInt3() {
    assertEq(value3, int(3847));
  }

  function test_validEmptyEqEmpty() {
    assertEq(int(0), int(0), "zero should be zero");
  }

  function test_validEmptyEqEmpty256() {
    assertEq(int256(0), int256(0), "zero 256 should be zero");
  }

  function test_invalidEmptyNotOne() {
    assertEq(int256(0), int256(1), "zero should not equal one");
  }

  function test_invalidEmptyEqVal() {
    assertEq(int256(0), value1, "zero should not equal value 1");
  }

  function testThrow_invalidZeroValue1() {
    if (int256(0) == value1) {
      throw;
    }
  }

  function test_invalidAddressNotZero() {
    assertEq(int(address(this)), value1, "address should not equal value 1");
  }

  function test_invalidEmptyEqVal1() {
    assertEq(value1, int(0), "value 1 should not equal zero");
  }

  function test_invalidValue1EqValue2() {
    assertEq(value1, value2, "value 1 should not equal value 2");
  }

  function test_invalidBalanceNotZero() {
    assertEq(this.balance, 0, "contract balance should not equal zero");
  }

  function test_twoValidEqInt() {
    assertEq(value1, value1, "value 1 should be value 1");
    assertEq(value2, int(374009283), "value 2 should be value 2");
  }

  function test_validContractBalance() {
    assertEq(this.balance, this.balance, "contract balance should be contract balance");
  }

  function test_twoValidEqInt2() {
    assertEq(int256(3847), value3, "value 3 should be value 3");
    assertEq(value2, value2, "value 2 should be value 2");
  }

  function test_threeInvalidEqInt() {
    assertEq(int256(3847), value1, "value 3 should not be value 1");
    assertEq(value2, value3, "value 2 should not be value 3");
    assertEq(value2, value1, "value 2 should not be value 1");
  }

  function test_threeValidEqInt() {
    assertEq(int256(3847), value3, "value 3 should be value 3");
    assertEq(value2, value2, "value 2 should be value 2");
    assertEq(value1, value1, "value 1 should be value 1");
  }

  function test_fourInvalidEqInt() {
    assertEq(int(0), value3, "zero should not be value 3");
    assertEq(int256(3847), value2, "value 3 should not be value 2");
    assertEq(value1, value2, "value 1 should not be value 2");
    assertEq(value2, value3, "value 2 should not be value 3");
  }

  function test_fourValidEqInt() {
    assertEq(int(0), int(0), "zero should be zero");
    assertEq(int256(3847), value3, "value 3 should be value 3");
    assertEq(value2, value2, "value 2 should be value 2");
    assertEq(value1, value1, "value 1 should be value 1");
  }
}
