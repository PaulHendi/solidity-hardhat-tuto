const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("Test weth", () => {

    let contract;
    let contractDeployed;

    let owner, alice;
    let owner_address, alice_address;

    beforeEach(async() => {

        contract = await ethers.getContractFactory("WETH");
        contractDeployed = await contract.deploy();

        [owner, alice] = await ethers.getSigners();
        owner_address = await owner.getAddress();

    })

    it("should test deposit and withdrawal of ETH and minting WETH by owner", async() => {

        let balance_owner = await contractDeployed.balanceOf(owner_address);
        let owner_eth_balance = await owner.getBalance();

        console.log("Owner balances before minting : ")
        console.log(" %s ETH ", ethers.utils.formatEther(owner_eth_balance))
        console.log(" %s WETH ", ethers.utils.formatEther(balance_owner));

        // Owner call deposit function
        await contractDeployed.deposit({value:ethers.utils.parseEther("1")});
        balance_owner = await contractDeployed.balanceOf(owner_address);
        owner_eth_balance = await owner.getBalance();

        console.log("Owner balances after minting: ")
        console.log(" %s ETH ", ethers.utils.formatEther(owner_eth_balance))
        console.log(" %s WETH ", ethers.utils.formatEther(balance_owner));


        // Owner call withdrawal function
        await contractDeployed.withdraw(ethers.utils.parseEther("1"));
        balance_owner = await contractDeployed.balanceOf(owner_address);
        owner_eth_balance = await owner.getBalance();

        console.log("Owner balances after burning WETH: ")
        console.log(" %s ETH ", ethers.utils.formatEther(owner_eth_balance))
        console.log(" %s WETH ", ethers.utils.formatEther(balance_owner));

    })

    it("should test deposit with the fallback function", async() => {

        tx = {
            to: contractDeployed.address,
            value: ethers.utils.parseEther("1")
        };
        await owner.sendTransaction(tx);

        balance_owner = await contractDeployed.balanceOf(owner_address);
        owner_eth_balance = await owner.getBalance();

        console.log("Owner balances sending ETH to the SC: ")
        console.log(" %s ETH ", ethers.utils.formatEther(owner_eth_balance))
        console.log(" %s WETH ", ethers.utils.formatEther(balance_owner));        

    })


    it("should test deposit with the receive function", async() => {

        tx = {
            to: contractDeployed.address,
            value: ethers.utils.parseEther("1"),
            data: "0x00"
        };
        await owner.sendTransaction(tx);

        balance_owner = await contractDeployed.balanceOf(owner_address);
        owner_eth_balance = await owner.getBalance();

        console.log("Owner balances sending ETH to the SC: ")
        console.log(" %s ETH ", ethers.utils.formatEther(owner_eth_balance))
        console.log(" %s WETH ", ethers.utils.formatEther(balance_owner));        

    })    

})