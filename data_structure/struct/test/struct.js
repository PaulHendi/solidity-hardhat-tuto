const {ethers} = require("hardhat");
const {expect} = require("chai");


describe('Test struct', () => { 

    let contract;
    let contractDeployed;

    let owner;
    let alice;

    beforeEach(async() => {

        contract = await ethers.getContractFactory("StructExamples");
        contractDeployed = await contract.deploy();

        [owner, alice] = await ethers.getSigners();

    })

    it("should register a toyota and a tesla, then get those registered data", async() => {

        await contractDeployed.register("Toyota", 2010);
        await contractDeployed.register("Tesla", 2020);

        const vehicle_1 = await contractDeployed.get(0);
        const vehicle_2 = await contractDeployed.get(1);
        await expect(contractDeployed.get(2)).to.be.reverted;

        const owner_address = await owner.getAddress();


        expect(vehicle_1.model).to.equal("Toyota");
        expect(vehicle_1.year).to.equal(2010);
        expect(vehicle_1.owner).to.equal(owner_address);


        expect(vehicle_2.model).to.equal("Tesla");
        expect(vehicle_2.year).to.equal(2020);
        expect(vehicle_2.owner).to.equal(owner_address);        

    })

    it("should register a Tesla and change owner", async ()=> {

        await contractDeployed.register("Tesla", 2020);
        const alice_address = await alice.getAddress();

        await contractDeployed.transfer(0, alice_address);

        const vehicle_1 = await contractDeployed.get(0);

        expect(vehicle_1.model).to.equal("Tesla");
        expect(vehicle_1.year).to.equal(2020);
        expect(vehicle_1.owner).to.equal(alice_address);


    })

 })