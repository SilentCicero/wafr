pragma solidity ^0.4.4;
/*
  Attestation Manager
  Mark Beylin
  Nov 11, 2016
*/
import "Contract.sol";

contract AttestationManager {
  string contractHash;
  Contract[] contracts;
  address creator;
  /*****   Constructor   *****/
  function AttestationManager () {
  }

  function addContractWithInfo(string _contractHash, string _title) returns (uint newId){
    newId = contracts.length;
    Contract newContract = new Contract(_contractHash, _title, msg.sender);
    contracts.push(newContract);
  }
  function attestToContract(uint id, bool attestation, string attestationType){
    if (id >= contracts.length){
      throw;
    }
    contracts[id].addAttestation(attestationType, attestation, msg.sender);
  }
}
