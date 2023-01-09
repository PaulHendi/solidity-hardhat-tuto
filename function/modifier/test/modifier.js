const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("Test modifier", () => {

    let contract;
    let contractDeployed;

    beforeEach(async () => {

        contract = await ethers.getContractFactory("FunctionModifier");
        contractDeployed = await contract.deploy();

    })

    it("should check paused is false", async () => {

        const paused = await contractDeployed.paused();

        expect(paused).to.equal(false);
    })

    it("should inc by two, then by 1 then dec by 1 to finally check count", async () => {

        let count = await contractDeployed.count();

        expect(count).to.equal(0);

        await contractDeployed.incBy(2);
        await contractDeployed.inc();
        await contractDeployed.dec();

        count = await contractDeployed.count();

        expect(count).to.equal(2);
    })

    it("should set pause and revert when inc or dec", async() => {

        await contractDeployed.setPause(true);
        const paused = await contractDeployed.paused();

        expect(paused).to.equal(true);

        await expect(contractDeployed.incBy(5)).to.be.reverted;
        await expect(contractDeployed.inc()).to.be.reverted;
        await expect(contractDeployed.dec()).to.be.reverted;
                

    })

    it("should inc by 1 then revert at reset, set to pause and finally reset", async() => {


        await contractDeployed.inc();

        count = await contractDeployed.count();
        expect(count).to.equal(1);
        
        await expect(contractDeployed.reset()).to.be.reverted;

        await contractDeployed.setPause(true);
        const paused = await contractDeployed.paused();
        expect(paused).to.equal(true);

        await contractDeployed.reset();

        count = await contractDeployed.count();
        expect(count).to.equal(0);        




    })

})