pragma solidity ^0.4.4;


contract Owner {
  modifier onlyowner() {
    // only allow a message sender than is the owner
    if (msg.sender == owner) {
      _;
    }
  }

  address public owner;
}
