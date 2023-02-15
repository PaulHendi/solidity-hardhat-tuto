const {ethers} = require("hardhat");


describe("StakingRewards", function () {

    let staking_contract, sft_contract; 
    let staking_contract_deployed, sft_contract_deployed; 

    let owner, alice, bob;

    beforeEach(async function () {


        // Get the Stacking contract
        staking_contract = await ethers.getContractFactory("StakingRewards");
        staking_contract_deployed = await staking_contract.attach("0x4628b2863F1F11E5d7460E7037eC5932fE202b4e");

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
        await(await sft_contract_deployed.setApprovalForAll(staking_contract_deployed.address, true)).wait(3);

        // // Alice approves as well
        // await(await sft_contract_deployed.connect(alice).setApprovalForAll(staking_contract_deployed.address, true)).wait(3);

        // // Bob approves as well
        // await(await sft_contract_deployed.connect(bob).setApprovalForAll(staking_contract_deployed.address, true)).wait(3);


        // Owner mints 5 SFT
        //await sft_contract_deployed.mint(5,{value:ethers.utils.parseEther("0.05")});

        // Alice mints 5 SFT
       // await sft_contract_deployed.connect(alice).mint(5,{value:ethers.utils.parseEther("0.05")});

        // Bob mints 5 SFT
       // await sft_contract_deployed.connect(bob).mint(5,{value:ethers.utils.parseEther("0.05")});

    });


    it("Should stake", async function () {


        // Owner stakes 1 NFT
        await(await staking_contract_deployed.stake(1)).wait(3);

        // // Get the state of the contract
        const user_data = await staking_contract_deployed.userdata(owner.address);

        // console.log(user_data);

        // Get duration
        const duration = await staking_contract_deployed._getDurationForUser(owner.address);

        console.log(duration);

        // Get total duratioj
        const total_duration = await staking_contract_deployed._getTotalDuration();

        console.log(total_duration);
    });


});