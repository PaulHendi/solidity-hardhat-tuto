const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("Test view and pure functions", () => {
    
    let contract;
    let contractDeployed;
    
    beforeEach(async () => {

        contract = await ethers.getContractFactory("ViewAndPureFunctions");
        contractDeployed = await contract.deploy();

    })

    it("should run pure functions with local variables", async () => {

        const result_1 = await contractDeployed.pureFunc();
        const result_2 = await contractDeployed.add(4,5);

        expect(result_1).to.equal(1);
        expect(result_2).to.equal(9);
    })

    it("should run view functions with state variables", async () => {

        const result_1 = await contractDeployed.viewFunc();
        const result_2 = await contractDeployed.addToNum(3);

        expect(result_1).to.equal(0);
        expect(result_2).to.equal(3);

    })
})