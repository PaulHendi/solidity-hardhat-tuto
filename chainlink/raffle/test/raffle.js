const {ethers}=require("hardhat");
const {expect}=require("chai");

describe("Raffle", function () {

    let raffle, random_number_generator;
    let raffle_deployed, random_number_generator_deployed;
    let owner, alice, bob, jack;

    beforeEach(async function () {

        raffle = await ethers.getContractFactory("Raffle");
        random_number_generator = await ethers.getContractFactory("RandomNumberGenerator");

        [owner, alice, bob, jack] = await ethers.getSigners();

        raffle_deployed = await raffle.deploy();
        random_number_generator_deployed = await random_number_generator.deploy();


    });

});