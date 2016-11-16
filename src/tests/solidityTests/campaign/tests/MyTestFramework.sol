pragma solidity ^0.4.4;

import "wafr/Test.sol";

contract MyTestFramework is Test {
    function logs(bytes b) { }
    function assert(bool what, bytes error) {
      if(!what) {
        fail(error);
      }
    }
    function fail(bytes error) {
//      logs(error);
      fail(error);
    }
    function log(bytes msg) {
//      logs(msg);
    }
    function log(bytes msg, uint i) {
//      logs(msg);
//      log_named_uint("val:", i);
    }

    function () payable {}
}
