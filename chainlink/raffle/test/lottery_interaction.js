const {ethers}=require("hardhat");
const {expect}=require("chai");
require("dotenv").config();

describe("Lottery", function () {

    let lottery, random_number_generator;
    let lottery_deployed, random_number_generator_deployed;
    let owner, alice, bob;

    beforeEach(async function () {

        lottery = await ethers.getContractFactory("Lottery");
        random_number_generator = await ethers.getContractFactory("RandomNumberConsumer");

        const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/fantom_testnet");

        owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        alice = new ethers.Wallet(process.env.PRIVATE_KEY_ALICE, provider);
        bob = new ethers.Wallet(process.env.PRIVATE_KEY_BOB, provider);


        lottery_deployed = await lottery.attach("0x9CD277E189a647eB1ADD9A0EdfA7Bc0b82C51Dd6")
        random_number_generator_deployed = await random_number_generator.attach("0x434941bF02c3463cBb35De5fc5b9D269b55A6152");

    });

    it("Test lottery", async function () {

        await(await lottery_deployed.start_new_lottery()).wait(2); // wait for 2 blocks to be mined


        // Print balances of every participants
        console.log("Owner balance:", (await ethers.provider.getBalance(owner.address)).toString());
        console.log("Alice balance:", (await ethers.provider.getBalance(alice.address)).toString());
        console.log("Bob balance:", (await ethers.provider.getBalance(bob.address)).toString());

        
        // Alice and Bob join the lottery
        await lottery_deployed.connect(alice).enter({value: ethers.utils.parseEther("0.1")});
        await lottery_deployed.connect(bob).enter({value: ethers.utils.parseEther("0.1")});

        // Owner joins the lottery as well
        await(await lottery_deployed.enter({value: ethers.utils.parseEther("0.1")})).wait(3); // wait for 3 blocks to be mined

        // Owner ends the lottery
        await lottery_deployed.end_lottery({gasLimit: 2500000});  // Max gas limit : 2,500,000 (from the docs)
        

    });

});