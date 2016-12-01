pragma solidity ^0.4.4;
/*
  Attestation
  Mark Beylin
  Nov 11, 2016
*/
contract Attestation{
  address attestor;
  string attestationType;
  bool agree;
  function Attestation(string _attestationType, bool _agree, address _attestor) {
  attestor = _attestor;
  attestationType = _attestationType;
  agree = _agree;
  }
}
