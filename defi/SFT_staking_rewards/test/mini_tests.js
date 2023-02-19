const {ethers} = require("hardhat");

// This script is useful to go step by step
// Waiting for the txs to appear in the explorer
// And checking the contract state 

describe("StakingRewards", function () {

    let staking_contract, sft_contract; 
    let staking_contract_deployed, sft_contract_deployed; 

    let owner, alice, bob;

    let user_data, duration, total_duration, rewards_share, rewards, total_staked;

    beforeEach(async function () {


        // Get the Stacking contract
        staking_contract = await ethers.getContractFactory("StakingRewards");
        staking_contract_deployed = await staking_contract.attach("0xe9d5bDDdCE57628ac65911235518d1dDD25c2546");

        await staking_contract_deployed.deployed();

        console.log("StakingRewards deployed to:", staking_contract_deployed.address)

        // Approve the staking contract to spend the SFTs
        sft_contract = await ethers.getContractFactory("SFT");
        sft_contract_deployed = await sft_contract.attach("0x6643fBC0D66fc580de15a0A0678D4c1f41b0071b");

        const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/fantom_testnet");


        owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        alice = new ethers.Wallet(process.env.PRIVATE_KEY_ALICE, provider);
        bob = new ethers.Wallet(process.env.PRIVATE_KEY_BOB, provider);


    });


    async function queryData(account, who) {
        
        console.log("*************************************")
        console.log("*****Querying data for " + who)
        console.log("*************************************")

        // Get userData 
        user_data = await staking_contract_deployed.userdata(account);
        console.log("User data : ");
        console.log(user_data);

        // Get duration
        duration = await staking_contract_deployed._getDurationForUser(account);
        console.log("Duration : " + duration);

        // Get total duration
        total_duration = await staking_contract_deployed._getTotalDuration();
        console.log("Total duration : " + total_duration);

        // Get rewards share 
        rewards_share = await staking_contract_deployed._getRewardsShare(account);
        console.log("Rewards share : " + rewards_share);

        // Get rewards
        rewards = await staking_contract_deployed.getRewards(account);
        console.log("Rewards : " + rewards);

        // Get total staked
        total_staked = await staking_contract_deployed.totalStaked();
        console.log("Total staked : " + total_staked);

    }


    it("Should test a normal scenario", async function () {

        // Alice unstakes
        console.log("Alice unstakes")
        await staking_contract_deployed.connect(alice).unstake(1);


        // Wait 20 seconds
        console.log("Waiting 20 seconds")
        await new Promise(r => setTimeout(r, 20000));

        // Query data
        await queryData(owner.address, "OWNER");

        await queryData(alice.address, "ALICE");

        await queryData(bob.address, "BOB");

    });


});