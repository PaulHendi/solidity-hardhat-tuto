const {ethers} = require("hardhat");


describe("StakingRewards", function () {

    let staking_contract, sft_contract; 
    let staking_contract_deployed, sft_contract_deployed; 

    let owner, alice, bob;

    let user_data, duration, total_duration, rewards_share, rewards, total_staked;

    beforeEach(async function () {


        // Get the Stacking contract
        staking_contract = await ethers.getContractFactory("StakingRewards");
        staking_contract_deployed = await staking_contract.deploy("0x6643fBC0D66fc580de15a0A0678D4c1f41b0071b");

        await staking_contract_deployed.deployed();

        console.log("StakingRewards deployed to:", staking_contract_deployed.address)

        // Approve the staking contract to spend the SFTs
        sft_contract = await ethers.getContractFactory("SFT");
        sft_contract_deployed = await sft_contract.attach("0x6643fBC0D66fc580de15a0A0678D4c1f41b0071b");

        const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/fantom_testnet");


        owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        alice = new ethers.Wallet(process.env.PRIVATE_KEY_ALICE, provider);
        bob = new ethers.Wallet(process.env.PRIVATE_KEY_BOB, provider);

        // Owner approves
        await sft_contract_deployed.setApprovalForAll(staking_contract_deployed.address, true);

        // Alice approves as well
        await sft_contract_deployed.connect(alice).setApprovalForAll(staking_contract_deployed.address, true);

        // Bob approves as well
        await sft_contract_deployed.connect(bob).setApprovalForAll(staking_contract_deployed.address, true);


        // Wait 10 seconds
        console.log("Everbody approves the staking contract");
        console.log("Now owner will send 1 FTM to the contract")
        console.log("Waiting 10 seconds")
        await new Promise(r => setTimeout(r, 10000));

        // Owner sends 1 FTM to the contract
        await(await owner.sendTransaction({to:staking_contract_deployed.address, value:ethers.utils.parseEther("1")})).wait(3);

        // Wait 10 seconds
        console.log("Waiting 10 seconds")
        await new Promise(r => setTimeout(r, 10000));

        // Owner mints 5 SFT
        await sft_contract_deployed.mint(5,{value:ethers.utils.parseEther("0.05")});

        // Alice mints 5 SFT
        await sft_contract_deployed.connect(alice).mint(5,{value:ethers.utils.parseEther("0.05")});

        // Bob mints 5 SFT
        await sft_contract_deployed.connect(bob).mint(5,{value:ethers.utils.parseEther("0.05")});

        console.log("Everyboy minted NFT");
        console.log("Waiting 10 seconds")
        await new Promise(r => setTimeout(r, 10000));

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

        // Get isStaking 
        isStaking = await staking_contract_deployed.staking(account);
        console.log("Is staking : " + isStaking);
    }


    it("Should test a normal scenario", async function () {


        // Owner stakes 1 NFT
        console.log("Owner stakes 1 NFT")
        await staking_contract_deployed.stake(1);

        // Wait 10 seconds
        console.log("Waiting 10 seconds")
        await new Promise(r => setTimeout(r, 10000));

        // Query data
        await queryData(owner.address, "OWNER");

        // Wait 10 seconds
        console.log("Waiting 10 seconds")
        await new Promise(r => setTimeout(r, 10000));

        // Alice stakes 2 NFT
        console.log("Alice stakes 2 NFT")
        await staking_contract_deployed.connect(alice).stake(2);

        // Wait 10 seconds
        console.log("Waiting 10 seconds")
        await new Promise(r => setTimeout(r, 10000));

        // Query data
        await queryData(owner.address, "OWNER");
        await queryData(alice.address, "ALICE");


        // Wait 10 seconds
        console.log("Waiting 10 seconds")
        await new Promise(r => setTimeout(r, 10000));

        // Bob stakes 3 NFT
        console.log("Bob stakes 3 NFT")
        await staking_contract_deployed.connect(bob).stake(3);


        // Wait 30 seconds
        console.log("Waiting 30 seconds")
        await new Promise(r => setTimeout(r, 30000));      
        
        // Query data
        await queryData(owner.address, "OWNER");
        await queryData(alice.address, "ALICE");
        await queryData(bob.address, "BOB");

        
        // Owner unstakes
        console.log("Owner unstakes")
        await staking_contract_deployed.unstake(1);

        // Wait 10 seconds
        console.log("Waiting 10 seconds")
        await new Promise(r => setTimeout(r, 10000));        

        // Query data
        await queryData(owner.address, "OWNER");
        await queryData(alice.address, "ALICE");
        await queryData(bob.address, "BOB");
        

        
        // Owner claims rewards
        console.log("Owner claims rewards")
        await staking_contract_deployed.claimRewards();
        

        // Wait 10 seconds
        console.log("Waiting 10 seconds")
        await new Promise(r => setTimeout(r, 10000));    
        
        
        // Query data
        await queryData(alice.address, "ALICE");
        await queryData(bob.address, "BOB");

        // Alice claims rewards
        console.log("Alice claims rewards")
        await staking_contract_deployed.connect(alice).claimRewards();


        // Wait 10 seconds
        console.log("Waiting 10 seconds")
        await new Promise(r => setTimeout(r, 10000));        

        // Query data
        await queryData(alice.address, "ALICE");
        await queryData(bob.address, "BOB");



        // Bob claims rewards
        console.log("Bob claims rewards")
        await staking_contract_deployed.connect(bob).claimRewards();

        // Wait 10 seconds
        console.log("Waiting 10 seconds")
        await new Promise(r => setTimeout(r, 10000));        

        // Query data
        await queryData(alice.address, "ALICE");
        await queryData(bob.address, "BOB");



        // Alice unstakes
        console.log("Alice unstakes")
        await staking_contract_deployed.connect(alice).unstake(2);

        // Wait 10 seconds
        console.log("Waiting 10 seconds")
        await new Promise(r => setTimeout(r, 10000));        

        // Query data
        await queryData(bob.address, "BOB");


        // Bob unstakes
        console.log("Bob unstakes")
        await staking_contract_deployed.connect(bob).unstake(3);

        // Wait 10 seconds
        console.log("Waiting 10 seconds")
        await new Promise(r => setTimeout(r, 10000));        


        // Owner withdraws remaining FTM
        await staking_contract_deployed.emergencyWithdraw();


    });


});