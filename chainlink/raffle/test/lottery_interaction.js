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

        [owner] = await ethers.getSigners();
        alice = new ethers.Wallet(process.env.PRIVATE_KEY_ALICE, ethers.provider);
        bob = new ethers.Wallet(process.env.PRIVATE_KEY_BOB, ethers.provider);


        lottery_deployed = await lottery.attach("0xD91E8f3E17B7a52a701D2537E3201B574eff977f")
        random_number_generator_deployed = await random_number_generator.attach("0xa5c37Ee9A1a119f5Aa1b786163DA5226B98288E6");

    });

    it("Test a simple raffle", async function () {


        

    });

});