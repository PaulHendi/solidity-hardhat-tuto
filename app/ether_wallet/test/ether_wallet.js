const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("Test ether wallet", () => {


    it("should test deposits and withdrawal", async () => {

        const contract = await ethers.getContractFactory("EtherWallet");
        const contractDeployed = await contract.deploy();

        const [owner, alice, bob] = await ethers.getSigners();
        const owner_address = await owner.address;
        const bob_address = await bob.address;
        const alice_address = await alice.address;

        let tx = {
            to: contractDeployed.address,
            value: ethers.utils.parseEther("1")
        };

        let balance_owner = await owner.getBalance();
        console.log("Balance owner before : %s",ethers.utils.formatEther(balance_owner))

        await owner.sendTransaction(tx);
        await alice.sendTransaction(tx);
        await bob.sendTransaction(tx);

        balance_owner = await owner.getBalance();
        console.log("Balance owner before : %s",ethers.utils.formatEther(balance_owner))

        //await expect(contractDeployed.connect(alice)["withdraw(uint)", 1]()).to.be.reverted; // Not owner

        await contractDeployed.withdraw(ethers.utils.parseEther("3"))

        balance_owner = await owner.getBalance();
        balance_alice = await alice.getBalance();
        balance_bob = await bob.getBalance();

        console.log("Balance owner after withdraw : %s",ethers.utils.formatEther(balance_owner))
        console.log("Balance alice after withdraw : %s",ethers.utils.formatEther(balance_alice))
        console.log("Balance bob after withdraw : %s",ethers.utils.formatEther(balance_bob))        



    })

})