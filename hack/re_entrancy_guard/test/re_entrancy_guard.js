const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("Test guess the number attack", () => {

    let reentrancy_guard, reentrancy_guard_test;
    let reentrancy_guard_deployed, reentrancy_guard_test_deployed;

    it("should guess the number by generating the pseudo random number", async() => {

        reentrancy_guard = await ethers.getContractFactory("ReentrancyGuard");
        reentrancy_guard_test = await ethers.getContractFactory("TestReentrancyGuard");

        reentrancy_guard_deployed = await reentrancy_guard.deploy();
        reentrancy_guard_test_deployed = await reentrancy_guard_test.deploy(10); // max call = 10


        // The guard makes it impossible to call back
        await expect(reentrancy_guard_deployed.test(reentrancy_guard_test_deployed.address)).to.be.reverted;


    })

})