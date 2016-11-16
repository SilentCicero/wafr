pragma solidity ^0.4.4;

import "wafr/Test.sol";
import "StandardCampaign.sol";
import "tests/MyTestFramework.sol";

contract User {
  function newCampaign(string _name,
    uint256 _expiry,
    uint256 _fundingGoal,
    address _beneficiary) returns (address) {
    return address(new StandardCampaign(_name, _expiry, _fundingGoal, _beneficiary, address(this)));
  }

  function newTestableCampaign(string _name,
    uint256 _expiry,
    uint256 _fundingGoal,
    address _beneficiary) returns (address) {
    return address(new TestableStandardCampaign(_name, _expiry, _fundingGoal, _beneficiary, address(this)));
  }

  function newContribution(address _campaign, uint256 _value) returns (uint) {
    StandardCampaign target = StandardCampaign(_campaign);
    return target.contributeMsgValue.value(_value)();
  }

  function User() {
  }

  function () payable {}
}

contract TestableStandardCampaign is StandardCampaign {
  function TestableStandardCampaign(string _name,
    uint256 _expiry,
    uint256 _fundingGoal,
    address _beneficiary,
    address _owner) StandardCampaign(_name,
    _expiry,
    _fundingGoal,
    _beneficiary,
    _owner)
    {
  }

  function () payable {}

  modifier validRefundClaim(uint256 _contributionID) {
    // get the contribution specified by ID "_contributionID"
    Contribution refundContribution = contributions[_contributionID];

    // if the refund for this contribution has not been claimed
    if(refundsClaimed[_contributionID] == true) { // the refund for this contribution is not claimed
// disabled the following condition (which exists in the original StandardCampaign contract in order
// to be able to test the method with different accounts
//      || refundContribution.sender != msg.sender){ // the contribution sender is the msg.sender
      throw;
    }

    // carry on with refund state changing contract logic
    _;
  }


  function setExpiry(uint _expiry) {
    expiry = _expiry;
  }

  function addTimeToExpiry(uint _timeToAdd) {
    expiry = expiry + _timeToAdd;
  }

  function setFundingGoal(uint256 _fundingGoal) {
    fundingGoal = _fundingGoal;
  }

  function getNow() public constant returns (uint nowvalue) {
    nowvalue = now;
  }

}

// contract that can forward to a modifiable target
contract Edge is MyTestFramework {
  // really no need for this, trg is sufficient to forward funds
  address public src;
  function setSrc(address _src) {
    src = _src;
  }

  function () payable {}

  // modifiable target
  address public trg;
  function setTrg(address _trg) {
    trg = _trg;
  }
  function payForward() returns (uint forwardedValue) {
    forwardedValue = this.balance;
    if (!trg.send(this.balance)) {
      log("Edge payForward failed, as desired");
    }
  }
}

contract TestableStandardCampaignTest is MyTestFramework, CampaignEvents {
  TestableStandardCampaign target;
  StandardCampaign targetStandardCampaign;
  User user ;
  string campaignName = "TestableStandardCampaign test - modifiable Standard Campaign";
  string standardCampaignContributeMethodABI = "contributeMsgValue():(uint256 contributionID)";
  string standardCampaignPayoutMethodABI = "payoutToBeneficiary():(uint256 amountClaimed)";

  function test_userSetup() {
    // build new user
    user = new User();

    // fill the user account with some funds
    assert(user.send(1000), "user send did not work");

    // ensure that the user account has a non-negative, positive balance
    // this is a workaround since assertTrue(user.balance>0, "user balance not greater than zero"); is not supported by dapple (bug)
    assert(user.balance > 0, "user balance is not greater than zero");
  }

  function test_standardCampaignConstructionValuesFailsDueToNoParameterValidation() {
    test_userSetup();
    uint256 expiry = 0;
    uint256 fundingGoal = 99999999999999999999999999999;
    address beneficiary = address(0);
    targetStandardCampaign = StandardCampaign(user.newCampaign(campaignName, expiry, fundingGoal, beneficiary));


    // assert(targetStandardCampaign.expiry() > 0, "Campaign expiry can be set to zero");
    // assert(targetStandardCampaign.fundingGoal() < 90000000000, "Campaign funding goal can be set very high");
    // assert(targetStandardCampaign.beneficiary() != address(0), "Campaign beneficiary can be 0x0 address");

    // assert(targetStandardCampaign.beneficiary() != address(targetStandardCampaign), "Campaign beneficiary is campaign itself");

    // expiry = now - 1 days;

    // targetStandardCampaign = StandardCampaign(user.newCampaign(campaignName, expiry, fundingGoal, beneficiary));

    // assert(targetStandardCampaign.expiry() > now, "Campaign expiry can be set into the past");
  }

  function test_testableStandardCampaignAbsolvementAfterPayout() {
    /*test_userSetup();
    uint256 expiry = now + 5 days;
    uint256 fundingGoal = 1;

    // create a mutable graph edge that will forward the funds from the campaign and the return them to the campaign
    Edge edge = new Edge();
    address beneficiary = address(edge);

    // this test shows the difficulty in finding forwarding cycles using solidity
    // essentially, highlights that as soon as there is a mutable contract as the beneficiary,
    // or is connected to a mutable contract, then the fiduciary responsibility of administering the fund is transferred to the
    // beneficiary upon beneficiary.send()
    // It is still the responsibility of the campaign to disallow further contributions to
    // prevent any further role in fund management

    // the motivation for this test is to identify whether a campaign can be held responsible if it receives the
    // funds dispensed to a beneficiary
    // the key finding is that since the beneficiary is fixed in a campaign, and it is required upon construction,
    // there is no way to directly set the beneficiary to the campaign itself, i.e., at least one other contract
    // is needed (forcing a transfer of fiduciary duty)

    target = TestableStandardCampaign(user.newTestableCampaign(campaignName, expiry, fundingGoal, beneficiary));

    // set the beneficiary's target as the campaign itself
    edge.setTrg(address(target));
    assert(address(target) == edge.trg(), "Mutable edge target not set to campaign");

    // show important restriction, cannot traverse address graph of connected contracts
    // can basically only check whether beneficiary is campaign itself, but we already proved (see above) that it cannot because
    // the beneficiary is immutable and is passed into the campaign constructor
    assert(target.beneficiary() != address(target), "Campaign beneficiary is campaign itself");

//    expectEventsExact(target);

    // contribute to campaign
    assert(user.newContribution(address(target), 250) == 0, "Contribution id of first contribution not equal to zero");

    ContributionMade(user);

    // expire the campaign so that we can payout the campaign to the beneficiary
    target.setExpiry(1);
    assert(target.expiry() == 1, "Testable Campaign expiry was not able to be set to 1");
    target.setFundingGoal(1);
    log("Amount raised:", target.amountRaised());
    log("Funding goal:", target.fundingGoal());
    log("stage:", target.stage());
    log("expiry:", target.expiry());
    log("balance:", target.balance);

    uint256 payout = target.payoutToBeneficiary();

    BeneficiaryPayoutClaimed(user, target.amountRaised());

    assert(payout > 0, "Campaign payout was not greater than zero");

    assert(target.beneficiary().balance == target.amountRaised(), "Beneficiary did not receive campaign funds after payout");
    log("beneficiary balance:", target.beneficiary().balance);
    log("campaign balance:", target.balance);

    assert(edge.payForward() == target.amountRaised(), "Beneficiary did not forward same amount of campaign amount raised");

    assert(target.beneficiary().balance == target.amountRaised(), "Beneficiary was able to send its balance to the campaign");

    assert(target.balance == 0, "Campaign somehow has funds");*/
  }

  // there are 3 main cases dependent on expiry and funding goal
  // 1 - campaign still active - test contribution
  // 2 - campaign expired, goal reached - test payoutToBeneficiary, dependent on case 1
  // 3 - campaign expired, goal not reached - test claimRefundOwed, dependent on case 1
  function test_testablestandardcampaignDeploymentAndUse() {
    test_userSetup();

    // setup campaign data
    uint256 expiry = now + 1 weeks;
    uint256 fundingGoal = 1000;
    address beneficiary = address(user);

    // start new campaign
    target = TestableStandardCampaign(user.newTestableCampaign(campaignName, expiry, fundingGoal, beneficiary));

    // test modifiable test class - expiry date
    assert(target.expiry() == expiry, "Testable Campaign expiry did not match what it was set to");

    // shows that testable campaign expiry can be set to zero
    target.setExpiry(0);
    assert(target.expiry() == 0, "Testable Campaign expiry could not be set to zero");

    target.setExpiry(expiry);
    assert(target.expiry() == expiry, "Testable Campaign expiry was not able to be set to non-zero expiry after previous zero value expiry");

    // test modifiable test class - funding goal
    assert(target.fundingGoal() == fundingGoal, "Testable campaign funding goal not equal to funding goal value");
    target.setFundingGoal(0);
    assert(target.fundingGoal() == 0, "Testable campaign funding goal could not be set to zero");
    target.setFundingGoal(fundingGoal);
    assert(target.fundingGoal() == fundingGoal, "Testable campaign funding goal could not be reset back to original funding goal");
  }

  function test_testableStandardCampaignContribution() {

    // prepare a testable campaign
    test_testablestandardcampaignDeploymentAndUse();

    // Case 1 - new contribution
    assert(user.newContribution(address(target), 250) == 0, "Contribution id of first contribution not equal to zero");
    assert(uint256(target.balance) == uint256(250), "Campaign balance not equal to only contribution value");
    assert(uint256(user.balance) == uint256(750), "User balance not correct after first contribution to campaign");

    // expect change in campaign amountraised and total contributions
    assert(target.amountRaised() == uint256(250), "Campaign amountRaised not equal to only contribution amount");
    assert(target.totalContributions() == uint256(1), "Campaign does not have exactly one contribution");
  }

  // test case 2 - that a payout can occur if the campaign expires and reaches its funding goal
  function test_testableStandardCampaignPayoutToBeneficiary() {

    // prepare a testable campaign with a single contribution
    test_testableStandardCampaignContribution();

    // case 2 setup - allow campaign to expire at next interaction with campaign
    target.setExpiry(1);
    target.setFundingGoal(1);

    uint256 originalBeneficiaryBalance = target.beneficiary().balance;
    uint256 payout = target.payoutToBeneficiary();

    BeneficiaryPayoutClaimed(user, target.amountRaised());

    assert(payout > 0, "Campaign payout was not greater than zero");
    assert(payout == target.amountRaised(), "Campaign payout was not equal to the amount raised");
    assert(target.balance == 0, "Ensure that campaign has no remaining balance");
    assert(originalBeneficiaryBalance + target.amountRaised() == target.beneficiary().balance, "Beneficiary did not receive campaign funds after payout to beneficiary");

  }

  // test case 3 - that a refund can occur if the campaign expires and does not reach its funding goal
  function test_testableStandardCampaignRefund() {

    // prepare a testable campaign with a single contribution
    test_testableStandardCampaignContribution();

    assert(target.totalContributions() > 0, "Campaign does not have any contributions to refund");

    // Case 3 setup - expire campaign and ensure that funding goal has not been met
    target.setExpiry(1);
    target.setFundingGoal(1000000000);

    assert(target.expiry() == 1, "Testable campaign expiry could not be set to 1");
    assert(target.fundingGoal() == 1000000000, "Testable campaign funding goal could not be set very high");

//    BalanceClaim[] claims;
//    mapping (uint => BalanceClaim) claims;
    uint claimSum = 0;
    for (uint contributionId = 0; contributionId < target.totalContributions(); contributionId++) {
      BalanceClaim claim = BalanceClaim(target.claimRefundOwed(contributionId));

      RefundPayoutClaimed(user, claim.balance);

      assert(claim.balance > 0, "Campaign refunded a balance claim with zero value");
      claimSum += claim.balance;
    }

//    BalanceClaim balanceClaim = BalanceClaim(target.claimRefundOwed(0)); // we know that it is contribution id 0 because at this point there is exactly one contribution
    assert(claimSum == target.amountRaised(), "campaign refund did not empty amountRaised");
    assert(target.balance == 0, "Campaign did not refund all of its funds");

  }

  // test - that no contribution is permitted if past expiry
  function test_testableContributionCaseExpectFailure() {
    // following should not be reached
    // assertEq(target.balance, 0);

    // prepare a testable campaign
    test_testablestandardcampaignDeploymentAndUse();

    // expire the campaign with a funding goal that can be reached
    target.setExpiry(0);
    target.setFundingGoal(1);

    // attempt a contribution to the expired campaign, the following line fails
    user.newContribution(address(target), 250);

    // following should not be reached
    // assertEq(target.balance, 0);

  }


  // test - that a payout is possible to execute even if no contribution was ever made
  function testThrow_testablePayoutCaseShouldBeFailure() {
    // prepare a testable campaign
    test_testablestandardcampaignDeploymentAndUse();

    // ensure that the campaign has no money
    assert(target.amountRaised() == 0, "Campaign should have a zero amountRaised");
    assert(target.balance == 0, "Campaign should have zero balance");

    // expire the campaign
    target.setExpiry(1);
    // set the funding goal to zero
    target.setFundingGoal(0);

    // the following fails - is it due to the attempt to send 0 ether?
    // there should probably be a check in the campaign to payout if amountRaised is greater than zero
    uint256 payout = target.payoutToBeneficiary();

    BeneficiaryPayoutClaimed(user, target.amountRaised());

    assert(payout == 0, "Campaign should have zero balance after payout");

    logs("This test should fail");

  }

}

contract StandardCampaignTest is MyTestFramework {
  StandardCampaign target;
  string campaignName = "Nicks Campaign";
  string standardCampaignContributeMethodABI = "contributeMsgValue():(uint256 contributionID)";
  string standardCampaignPayoutMethodABI = "payoutToBeneficiary():(uint256 amountClaimed)";

  function test_standardCampaignDeploymentAndUse() {
    // build new user
    User user = new User();
    bool f1 = user.send(1000);

    // setup campaign data
    uint256 expiry = now + 1 weeks;
    uint256 fundingGoal = 1000;
    address beneficiary = address(user);

    // start new campaign
    target = StandardCampaign(user.newCampaign(campaignName, expiry, fundingGoal, beneficiary));
    assert(target.stage() == uint256(0), "Campaign should be in operational mode");
    assert(target.amountRaised() == uint256(0), "Campaign should not have raised any funds yet");
    assert(target.fundingGoal() == fundingGoal, "Campaign funding goal is not what is expected");
    assert(target.expiry() == expiry, "Campaign expirty not what is expected");
    assert(target.beneficiary() == beneficiary, "Campaign beneficiary not what is expected");
    assert(target.totalContributions() == uint256(0), "Campaign should not have any contributions");
    assert(target.owner() == address(user), "Campaign owner should be initial user");

    // new contribution
    assert(user.newContribution(address(target), 250) == uint256(0), "First contribution to campaign was expected to have contribution id zero");
    assert(uint256(target.balance) == uint256(250), "Campaign should have a balance after contribution");
    assert(uint256(user.balance) == uint256(750), "Contribution to campaign should have reduced user balance");

    // test everything again for varience
    assert(target.stage() == uint256(0), "post-contribution campaign stage is not operational");
    assert(target.fundingGoal() == fundingGoal, "post-contribution campaign funding goal did not remain the same");
    assert(target.expiry() == expiry, "post-contribution campaign expiry did not remain the same");
    assert(target.beneficiary() == beneficiary, "post-contribution campaign beneficiary did not remain the same");

    // expect varience from..
    assert(target.amountRaised() == uint256(250), "post-contribution campaign amountraised should reflect single contribution");
    assert(target.totalContributions() == uint256(1), "post-contribution campaign number of contributions should equal one");

    // new contribution number 2
    assert(user.newContribution(address(target), 250) == uint256(1), "second contribution to campaign should have contribution id one");
    assert(uint256(target.balance) == uint256(500), "second contribution should add to campaign's balance");
    assert(uint256(user.balance) == uint256(500), "second contribution should decrease user's balance");

    // test everything again for varience
    assert(target.stage() == uint256(0), "second contribution should leave campaign in operational stage");
    assert(target.fundingGoal() == fundingGoal, "second contribution should not change campaign funding goal");
    assert(target.expiry() == expiry, "second contribution should not change campaign expiry");
    assert(target.beneficiary() == beneficiary, "second contribution should not chage campaign beneficiary");

    // expect varience from..
    assert(target.amountRaised() == uint256(500), "second contribution did not update campaign amount raised");
    assert(target.totalContributions() == uint256(2), "second contribution did not set number of contributions to two");
  }
}
