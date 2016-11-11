pragma solidity ^0.4.4;

import "wafr/Test.sol";
import "test.assertTrueSmall.sol";

contract AssertTrueImportTest is AssertTrueSmallTest {
  function test_fiveAssertFalse() {
    assertTrue(false, "one false assert");
    assertTrue(false, "two false assert");
    assertTrue(false, "two false assert");
    assertTrue(false, "two false assert");
    assertTrue(false, "two false assert");
  }

  function test_fiveAssertTrue() {
    assertTrue(true, "one true assert");
    assertTrue(true, "two true assert");
    assertTrue(true, "two true assert");
    assertTrue(true, "two true assert");
    assertTrue(true, "two true assert");
  }
}
