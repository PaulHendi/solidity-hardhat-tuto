const {ethers} = require("hardhat");
const {expect} = require("chai");
const {time} = require("@nomicfoundation/hardhat-network-helpers");


describe("Test App hodl", () => {

    let contract;
    let contractDeployed;
    let owner_address, alice_address;
    let balance_owner, balance_alice;
    let lockedUntil_owner, lockedUntil_alice;

    beforeEach(async() => {

        contract = await ethers.getContractFactory("Hodl");
        contractDeployed = await contract.deploy();

        const [owner, alice] = await ethers.getSigners();
        owner_address = await owner.getAddress();
        alice_address = await alice.getAddress();

    })

    it("should test deposits and withdrawal before hodl duration", async () => {

        await contractDeployed.deposit({value: ethers.utils.parseEther("1")});

        balance_owner = await contractDeployed.balanceOf(owner_address);
        lockedUntil_owner = await contractDeployed.lockedUntil(owner_address);

        console.log(balance_owner);
        console.log(lockedUntil_owner);

        // TODO : need to send with alice's account (How to send a tx a a function call)

        await expect(contractDeployed.withdraw()).to.be.reverted; // Withdraw too soon


    })


    it("should test deposits and withdrawal after hodl duration", async () => {

        await contractDeployed.deposit({value: ethers.utils.parseEther("1")});

        balance_owner = await contractDeployed.balanceOf(owner_address);
        lockedUntil_owner = await contractDeployed.lockedUntil(owner_address);

        console.log(balance_owner);
        console.log(lockedUntil_owner);

        // TODO : need to send with alice's account (How to send a tx a a function call)

        await time.increase(3 * 365 * 24 * 60 * 60); // Wait 3 years


        await contractDeployed.withdraw(); // Withdraw too soon        


    })

})