pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract AnotherContract {}

contract AssertEqAddressTest is Test {
  address addr1;
  address addr2;
  address addr3;

  function setup() {
    addr1 = msg.sender;
    addr2 = address(this);
    addr3 = address(new AnotherContract());
  }

  function test_oneValidEqAddress() {
    assertEq(addr1, addr1);
  }

  function test_twoValidEqAddress() {
    assertEq(addr1, addr1, "address 1 should equal address 1");
    assertEq(addr2, addr2, "address 2 should equal address 2");
  }

  function test_threeValidEqAddress() {
    assertEq(addr1, addr1, "address 1 should equal address 1");
    assertEq(addr2, addr2, "address 2 should equal address 2");
    assertEq(addr3, addr3, "address 3 should equal address 3");
  }

  function test_oneValidEmptyAddress() {
    assertEq(address(0), address(0), "empty address should equal empty address");
  }

  function test_oneInvalidEmptyAddress() {
    assertEq(addr1, address(0), "address 1 does not equal address 0");
  }

  function test_messageSenderEq() {
    assertEq(msg.sender, msg.sender, "message sender should equal message sender");
  }

  function test_oneInvalidEqAddress() {
    assertEq(addr1, addr2, "should be invalid");
  }

  function test_twoInvalidEqAddress() {
    assertEq(addr1, addr2, "address 1 should not equal address 2");
    assertEq(addr2, addr3, "address 2 should not equal address 3");
  }

  function test_threeInvalidEqAddress() {
    assertEq(addr1, addr2, "address 1 should not equal address 2");
    assertEq(addr2, addr3, "address 2 should not equal address 3");
    assertEq(addr3, addr1, "address 3 should not equal address 1");
  }

  function test_oneValidAndInvalidEqAddress() {
    assertEq(address(0), address(0), "empty address should equal empty address");
    assertEq(addr1, addr3, "address 1 should not equal address 3");
  }

  function test_twoValidAndInvalidEqAddress() {
    assertEq(addr2, addr1, "address 2 should not equal address 1");
    assertEq(address(0), addr3, "empty address should not equal address 3");
    assertEq(address(0), address(0), "empty address should equal empty address");
    assertEq(addr1, addr1, "address 1 should equal address 1");
  }

  function test_threeValidAndInvalidEqAddress() {
    assertEq(addr2, addr1, "address 2 should not equal address 1");
    assertEq(address(0), addr3, "empty address should not equal address 3");
    assertEq(addr2, addr3, "address 2 should not equal address 3");
    assertEq(address(0), address(0), "empty address should equal empty address");
    assertEq(addr1, addr1, "address 1 should equal address 1");
    assertEq(msg.sender, msg.sender, "address 3 should equal address 3");
  }
}
