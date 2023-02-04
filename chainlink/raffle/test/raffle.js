const {ethers}=require("hardhat");
const {expect}=require("chai");

describe("Raffle", function () {

    let raffle, random_number_generator;
    let raffle_deployed, random_number_generator_deployed;
    let owner;

    beforeEach(async function () {

        raffle = await ethers.getContractFactory("Lottery");
        random_number_generator = await ethers.getContractFactory("RandomNumberConsumer");

        [owner] = await ethers.getSigners();

        raffle_deployed = await raffle.attach("0xD91E8f3E17B7a52a701D2537E3201B574eff977f")
        random_number_generator_deployed = await random_number_generator.attach("0xa5c37Ee9A1a119f5Aa1b786163DA5226B98288E6");

    });

    it("Should return the current balance", async function () {
    });

});