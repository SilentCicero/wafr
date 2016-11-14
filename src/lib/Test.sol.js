module.exports = `pragma solidity ^0.4.4;

contract Test {
  function () payable {}

  function setup() {}

  function assertTrue(bool _testValue, string _message) {
    AssertEqLog("AssertTrue", boolToBytes32(_testValue), boolToBytes32(true), _message);
  }

  function assertTrue(bool _testValue) {
    AssertEqLog("AssertTrue", boolToBytes32(_testValue), boolToBytes32(true), "");
  }

  function assertFalse(bool _testValue, string _message) {
    AssertEqLog("AssertFalse", boolToBytes32(_testValue), boolToBytes32(false), _message);
  }

  function assertFalse(bool _testValue) {
    AssertEqLog("AssertFalse", boolToBytes32(_testValue), boolToBytes32(false), "");
  }

  function assertEq(uint _actual, uint _expected) {
    AssertEqLog("AssertEq", bytes32(_actual), bytes32(_expected), "");
  }

  function assertEq(int _actual, int _expected) {
    AssertEqLog("AssertEq", bytes32(_actual), bytes32(_expected), "");
  }

  function assertEq(int _actual, int _expected, string _message) {
    AssertEqLog("AssertEq", bytes32(_actual), bytes32(_expected), _message);
  }

  function assertEq(address _actual, address _expected) {
    AssertEqLog("AssertEq", bytes32(_actual), bytes32(_expected), "");
  }

  function assertEq(bool _actual, bool _expected) {
    AssertEqLog("AssertEq", boolToBytes32(_actual), boolToBytes32(_expected), "");
  }

  function assertEq(uint _actual, uint _expected, string _message) {
    AssertEqLog("AssertEq", bytes32(_actual), bytes32(_expected), _message);
  }

  function assertEq(address _actual, address _expected, string _message) {
    AssertEqLog("AssertEq", bytes32(_actual), bytes32(_expected), _message);
  }

  function assertEq(bool _actual, bool _expected, string _message) {
    AssertEqLog("AssertEq", boolToBytes32(_actual), boolToBytes32(_expected), _message);
  }

  function assertEq(string _actual, string _expected) {
    AssertEqLog("AssertEq", sha3(_actual), sha3(_expected), "");
  }

  function assertEq(string _actual, string _expected, string _message) {
    AssertEqLog("AssertEq", sha3(_actual), sha3(_expected), _message);
  }

  function assertEq(bytes _actual, bytes _expected) {
    AssertEqLog("AssertEq", sha3(_actual), sha3(_expected), "");
  }

  function assertEq(bytes _actual, bytes _expected, string _message) {
    AssertEqLog("AssertEq", sha3(_actual), sha3(_expected), "");
  }

  function boolToBytes32(bool _value) constant returns (bytes32) {
    if (_value == true) {
      return bytes32(uint(1));
    } else {
      return bytes32(uint(0));
    }
  }

  event log_uint(uint256 _logValue, string _message);
  event AssertEqLog(string _type, bytes32 _actualValue, bytes32 _expectedValue, string _message);
}
`;
