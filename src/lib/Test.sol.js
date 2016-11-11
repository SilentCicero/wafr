module.exports = `pragma solidity ^0.4.4;

contract Test {
  function () payable {}

  function setup() {}

  function assertTrue(bool _testValue, string _message) {
    AssertTrueLog(_testValue, _message);
  }

  event AssertTrueLog(bool _testValue, string _message);
}
`;
