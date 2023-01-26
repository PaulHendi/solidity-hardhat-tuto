const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("Test ETH flash loan exploit", () => {

    let lending_pool, attacker;
    let lending_pool_deployed, attacker_deployed;

    let balance_attacker, balance_sc;


    it("Should drain all ETH tokens from the lending pool", async() => {

        lending_pool = await ethers.getContractFactory("EthLendingPool");
        attacker = await ethers.getContractFactory("EthLendingPoolExploit");

        lending_pool_deployed = await lending_pool.deploy();
        attacker_deployed = await attacker.deploy(lending_pool_deployed.address);


        // Owner sends some eth to the lending pool for the test
        const [owner] = await ethers.getSigners();
        await owner.sendTransaction({to:lending_pool_deployed.address, value:ethers.utils.parseEther("10.0")});


        balance_attacker = await ethers.provider.getBalance(attacker_deployed.address);
        balance_sc = await ethers.provider.getBalance(lending_pool_deployed.address);
        console.log("BEFORE EXPLOIT \nBal attacker : %s, bal SC : %s", 
                    ethers.utils.formatEther(balance_attacker), 
                    ethers.utils.formatEther(balance_sc));


        // Now the attack can start
        await attacker_deployed.pwn()
        
        balance_attacker = await ethers.provider.getBalance(attacker_deployed.address);
        balance_sc = await ethers.provider.getBalance(lending_pool_deployed.address);
        console.log("BEFORE EXPLOIT \nBal attacker : %s, bal SC : %s", 
                    ethers.utils.formatEther(balance_attacker), 
                    ethers.utils.formatEther(balance_sc));
    })
    

})