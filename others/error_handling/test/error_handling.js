const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("Test error handling", () => {

    let contract;
    let contractDeployed;

    beforeEach(async() => {

        contract = await ethers.getContractFactory("ErrorHandling");
        contractDeployed = await contract.deploy();

    })

    it("should test require", async () => {

        // first no tx revert
        await contractDeployed.testRequire(5);

        // Then a tx revert
        await expect(contractDeployed.testRequire(11)).to.be.reverted;

    })

    it("should test revert", async () => {

        // first no tx revert
        await contractDeployed.testRevert(4);

        // Then a tx revert
        await expect(contractDeployed.testRevert(20)).to.be.reverted;

    })    


    it("should test assert", async () => {

        await contractDeployed.testAssert(); // Okay never going to fail

    })


})