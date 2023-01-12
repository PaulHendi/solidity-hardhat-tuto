const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("Test iterable mapping", () => {


    let contract;
    let contractDeployed;

    let owner_address;
    let alice_address;
    let bob_address;

    let balance;

    beforeEach(async() => {

        contract = await ethers.getContractFactory("IterableMapping");
        contractDeployed = await contract.deploy();

        let [owner, alice, bob] = await ethers.getSigners();
        owner_address = await owner.getAddress();
        alice_address = await alice.getAddress();
        bob_address = await bob.getAddress();

    })

    it("should test set and get from an iterable mapping", async() => {

        await contractDeployed.set(owner_address, 1000);
        await contractDeployed.set(alice_address, 200);
        await contractDeployed.set(bob_address, 100);

        balance = await contractDeployed.get(0);
        expect(balance).to.equal(1000);

        balance = await contractDeployed.get(1);
        expect(balance).to.equal(200);

        balance = await contractDeployed.get(2);
        expect(balance).to.equal(100);

        balance = await contractDeployed.first();
        expect(balance).to.equal(1000);

        balance = await contractDeployed.last();
        expect(balance).to.equal(100);        

    })

})