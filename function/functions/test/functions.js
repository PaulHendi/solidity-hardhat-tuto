const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("Test functions", () => {

    let contract;
    let contractDeployed;

    beforeEach(async () => {
        contract = await ethers.getContractFactory("Function");
        contractDeployed = await contract.deploy();
    })

    it("should add 5 and 4", async () => {

        const result = await contractDeployed.add(5,4);

        expect(result).to.equal(9);

    })

    it("should substract 9 from 14", async () => {

        const result = await contractDeployed.sub(14,9);

        expect(result).to.equal(5);

    })   

})