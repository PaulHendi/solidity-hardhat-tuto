const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("Test simple storage", () => {

    it("should set a text and get it", async()=> {

        const contract = await ethers.getContractFactory("SimpleStorage");
        const contractDeployed = await contract.deploy();

        await contractDeployed.set("Hello World!");

        const text_saved = await contractDeployed.get();

        expect(text_saved).to.equal("Hello World!");

    })

})