const {ethers} = require("hardhat");
const {expect} = require("chai");
const {time} = require("@nomicfoundation/hardhat-network-helpers");

describe("Test crowd fund", () => {

    let crowd_fund_contract, CFT_contract;
    let crowd_fund_contract_deployed, CFT_contract_deployed;

    let owner, bob, alice, jack;
    let owner_address, bob_address, alice_address, jack_address;

    const ONE_DAY = 24 * 60 * 60;


    beforeEach(async() => {

        CFT_contract = await ethers.getContractFactory("CFT");
        CFT_contract_deployed = await CFT_contract.deploy();
        const CFT_contract_address = CFT_contract_deployed.address;

        crowd_fund_contract = await ethers.getContractFactory("CrowdFund");
        crowd_fund_contract_deployed = await crowd_fund_contract.deploy(CFT_contract_address);


        [owner, bob, alice, jack] = await ethers.getSigners();
        owner_address = await owner.getAddress();
        bob_address = await bob.getAddress();
        alice_address = await alice.getAddress();
        jack_address = await jack.getAddress();

        // Owner of tokens sends a bunch to bob, alice and Jack for them to use in the crowdfund tests
        CFT_contract_deployed.transfer(bob_address, 1000);
        CFT_contract_deployed.transfer(alice_address, 1000);
        CFT_contract_deployed.transfer(jack_address, 1000);        

    })


    it("should test a simple crowd fund", async() => {

        const curr_block = await ethers.provider.getBlock();
        let curr_timestamp = curr_block.timestamp;

        let goal = 10; // Goal : raise 10 CFT
        let beginAt = curr_timestamp + ONE_DAY; // Starts in 1 day
        let endAt = beginAt + 3 * ONE_DAY; // Ends 3 days after
        await crowd_fund_contract_deployed.launch(goal, beginAt, endAt);

        let campaign_id = 1;

        // Check the campaign
        let campaign = await crowd_fund_contract_deployed.campaigns(campaign_id);
        console.log(campaign);

        // Alice gives 5 ETH
        let crowdfundAsAlice = await crowd_fund_contract_deployed.connect(alice);
        // But at first too soon
        await expect(crowdfundAsAlice.pledge(campaign_id, 5)).to.be.reverted;
        // One day passes ...
        await time.increase(ONE_DAY); 
        // Now she can give
        let CFTAsAlice = await CFT_contract_deployed.connect(alice);
        await CFTAsAlice.approve(crowdfundAsAlice.address, 5); // Need to approve first because transferFrom is used in pledge
        await crowdfundAsAlice.pledge(campaign_id, 5);


        // Now Bob gives
        let crowdfundAsBob = await crowd_fund_contract_deployed.connect(bob);
        let CFTAsBob = await CFT_contract_deployed.connect(bob);
        await CFTAsBob.approve(crowdfundAsBob.address, 9);       
        await crowdfundAsBob.pledge(campaign_id, 9);



        // Check the campaign
        campaign = await crowd_fund_contract_deployed.campaigns(campaign_id);
        console.log(campaign);        

        // Wait for 3 days
        await time.increase(3*ONE_DAY); 

        // Owner claim
        await crowd_fund_contract_deployed.claim(1);

    })


    it("should launch and cancel campaign", async() => {

        const curr_block = await ethers.provider.getBlock();
        let curr_timestamp = curr_block.timestamp;

        let goal = ethers.utils.parseEther("10.0"); // Goal : raise 10 ETH
        let beginAt = curr_timestamp + ONE_DAY; // Starts in 1 day
        let endAt = beginAt + 3 * ONE_DAY; // Ends 3 days after
        await crowd_fund_contract_deployed.launch(goal, beginAt, endAt);

        let campaign_id = 1;

        // Check the campaign
        let campaign = await crowd_fund_contract_deployed.campaigns(campaign_id);
        console.log(campaign);

        // Alice tries to cancel the campaign
        let contractAsAlice = await crowd_fund_contract_deployed.connect(alice);
        await expect(contractAsAlice.cancel(campaign_id)).to.be.reverted;

        // Owner cancel the campaign
        await crowd_fund_contract_deployed.cancel(campaign_id)

        // Check the campaign
        campaign = await crowd_fund_contract_deployed.campaigns(campaign_id);
        console.log(campaign);
    })


    // A lot more tests can be done ..

})