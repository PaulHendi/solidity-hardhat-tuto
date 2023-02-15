const {ethers} = require("hardhat");


describe("StakingRewards", function () {

    let staking_contract, sft_contract; 
    let staking_contract_deployed, sft_contract_deployed; 

    let owner, alice, bob;

    beforeEach(async function () {


        // Get the Stacking contract
        staking_contract = await ethers.getContractFactory("StakingRewards");
        staking_contract_deployed = await staking_contract.attach("0x8310118D36B2CaA754f0B791B4ef876D8DEB4700");

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


        // Owner mints 5 SFT
       // await sft_contract_deployed.mint(5,{value:ethers.utils.parseEther("0.05")});

        // Alice mints 5 SFT
       // await sft_contract_deployed.connect(alice).mint(5,{value:ethers.utils.parseEther("0.05")});

        // Bob mints 5 SFT
       // await sft_contract_deployed.connect(bob).mint(5,{value:ethers.utils.parseEther("0.05")});

    });


    it("Should stake", async function () {


        // Owner stakes 2 NFT
        //await staking_contract_deployed.stake(2);

        // Get the state of the contract
        const user_data = await staking_contract_deployed.userdata(owner.address);

        console.log(user_data);


    });


});