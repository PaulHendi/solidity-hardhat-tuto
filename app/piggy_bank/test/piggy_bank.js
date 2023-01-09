const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("Test piggy bank", () => {

    it("should test deposits from different addresses and withdraw from owner", async() => {

        const contract = await ethers.getContractFactory("PiggyBank");
        const contractDeployed = await contract.deploy();

        const [owner, alice, bob] = await ethers.getSigners();
       
        let balance_owner = await owner.getBalance();
        console.log("Balance owner before : %s",ethers.utils.formatEther(balance_owner))
        

        let tx = {
            to: contractDeployed.address,
            value: ethers.utils.parseEther("5000")
        };
        
        await owner.sendTransaction(tx);
        await alice.sendTransaction(tx);
        await bob.sendTransaction(tx);

        let balance_sc = await contractDeployed.balance();
        balance_owner = await owner.getBalance();

        console.log("Balance owner after : %s",ethers.utils.formatEther(balance_owner))
        console.log("Balance SC : %s",ethers.utils.formatEther(balance_sc))

        await expect(contractDeployed.connect(alice)["withdraw()"]()).to.be.reverted; // Not owner

        await contractDeployed.withdraw()

        await expect(contractDeployed.balance()).to.be.reverted; // SC has been destructed
        balance_owner = await owner.getBalance();
        balance_alice = await alice.getBalance();
        balance_bob = await bob.getBalance();

        console.log("Balance owner after withdraw : %s",ethers.utils.formatEther(balance_owner))
        console.log("Balance alice after withdraw : %s",ethers.utils.formatEther(balance_alice))
        console.log("Balance bob after withdraw : %s",ethers.utils.formatEther(balance_bob))

    })

})