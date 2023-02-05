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


        lottery_deployed = await lottery.attach("0x5D0a640BDDd4a44e89bc5a322d54f61C8BB293b9")
        random_number_generator_deployed = await random_number_generator.attach("0xE98B06f42cB0D4cAE600b647b31b16800E838642");

    });

    it("Test lottery", async function () {

        //await lottery_deployed.start_new_lottery();


        // Print balances of every participants
        console.log("Owner balance:", (await ethers.provider.getBalance(owner.address)).toString());
        console.log("Alice balance:", (await ethers.provider.getBalance(alice.address)).toString());
        console.log("Bob balance:", (await ethers.provider.getBalance(bob.address)).toString());

        
        // Alice and Bob join the lottery
        await lottery_deployed.connect(alice).enter({value: ethers.utils.parseEther("0.1")});
        await lottery_deployed.connect(bob).enter({value: ethers.utils.parseEther("0.1")});


        // Owner ends the lottery
        await lottery_deployed.end_lottery({gasLimit: 2500000});  // Max gas limit : 2,500,000 (from the docs)
        

    });

});