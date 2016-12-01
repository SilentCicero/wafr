pragma solidity ^0.4.4;

/*
  Attestation
  Mark Beylin
  Nov 11, 2016
*/
import "Attestation.sol";

contract Contract {
  string contractHash;
  string title;
  address author;
  address liveAddress;
  Attestation[] attList;
  function Contract(string _contractHash, string _title, address _author) {
  contractHash = _contractHash;
  title = _title;
  author = _author;
  }
  function changeAddress(address _newAddress){
    if (msg.sender == author){
      liveAddress = _newAddress;
    } else {
      throw;
    }
  }
  function addAttestation(string attestationType, bool agree, address attestor){
    Attestation newAtt = new Attestation(attestationType, agree, attestor);
    attList.push(newAtt);
    //make new attestation struct with given type, agreement, and attestor is msg.sender
    //should check to see that attestor hasn't done so previously
    //Should check with AttRegistry to ensure that only the owner of a given att.type can attest?
    //Different attestation types have different ownders
    //registry allows for creation of att-type with att rules (only one person can make it, one person must approve requests?)
  }
}
