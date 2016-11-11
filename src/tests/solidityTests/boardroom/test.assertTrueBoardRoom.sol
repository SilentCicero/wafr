pragma solidity ^0.4.4;

import "wafr/Test.sol";
import "boardroom/BoardRoom.sol";
import "boardroom/OpenRules.sol";

contract AssertTrueBoardRoomTest is Test {
  function test_setupBoardRoomAndAssert() {
    OpenRules rules = new OpenRules();
    BoardRoom board = new BoardRoom(address(rules));

    assertTrue(board.rules() == address(rules), "rules address is correct");
    assertTrue(board.balance == 0, "board balance is zero");

    board.newProposal("Some Awesome Sauce Proposal",
      address(0),
      30,
      address(0),
      400,
      "");

    assertTrue(board.numProposals() == 1, "number of proposals is one");
  }
}
