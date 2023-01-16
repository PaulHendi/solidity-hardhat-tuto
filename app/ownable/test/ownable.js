const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("Test ownable", () => {

    let contract;
    let contractDeployed;

    it("should set new owner", async() => {

        contract = await ethers.getContractFactory("Ownable");
        contractDeployed = await contract.deploy(); // owner deploy it 

        const [owner, alice, bob] = await ethers.getSigners();
        const owner_address = await owner.getAddress();
        const alice_address = await alice.getAddress();
        const bob_address = await bob.getAddress();

        // Set Alice as the new owner
        await contractDeployed.setOwner(alice_address);

        // Old owner cannot change the owner anymore
        await expect(contractDeployed.setOwner(bob_address)).to.be.reverted;

        // TODO : Should test setOwner with alice's account

    })

})