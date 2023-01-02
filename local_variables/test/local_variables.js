const {expect} = require("chai");
const {ethers} = require("hardhat");


describe("Test local variables", () => {

    let contract;
    let contractDeployed;

    beforeEach(async () => {

        contract = await ethers.getContractFactory("LocalVariables");
        contractDeployed = await contract.deploy();

    })

    it("should return the product of 123456 by itself", async () => {

        const result = await contractDeployed.mul();
        console.log(result);

        expect(result).to.equal(15241383936);
    })

})