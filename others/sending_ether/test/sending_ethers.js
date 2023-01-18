const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("Test sending ether", () => {

    let contract;
    let contractDeployed;

    let balance_alice;

    it("should test different way of sending ether", async() => {

        contract = await ethers.getContractFactory("SendEther");
        contractDeployed = await contract.deploy();

        const [owner, alice] = await ethers.getSigners();
        const alice_address = await alice.getAddress();

        balance_alice = await alice.getBalance();
        expect(ethers.utils.formatEther(balance_alice)).to.equal("10000.0");


        // Send via transfer method
        await contractDeployed.sendViaTransfer(alice_address, {value: ethers.utils.parseEther("1")});

        balance_alice = await alice.getBalance();
        expect(ethers.utils.formatEther(balance_alice)).to.equal("10001.0");

        // Send via send method
        await contractDeployed.sendViaSend(alice_address, {value: ethers.utils.parseEther("1")});

        balance_alice = await alice.getBalance();
        expect(ethers.utils.formatEther(balance_alice)).to.equal("10002.0");
        
        // Send via call method (best one)
        await contractDeployed.sendViaCall(alice_address, {value: ethers.utils.parseEther("1")});

        balance_alice = await alice.getBalance();
        expect(ethers.utils.formatEther(balance_alice)).to.equal("10003.0");

    })

})