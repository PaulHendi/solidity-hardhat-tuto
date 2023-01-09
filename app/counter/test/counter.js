const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("Test counter", () => {

    it("should increment, decrement and get count", async() => {

        const contract = await ethers.getContractFactory("Counter");
        const contractDeployed = await contract.deploy();

        let count = await contractDeployed.count();
        expect(count).to.equal(0);

        await contractDeployed.inc();
        await contractDeployed.inc();
        await contractDeployed.inc();
        await contractDeployed.dec();

        count = await contractDeployed.count();
        expect(count).to.equal(2);        


    })

})