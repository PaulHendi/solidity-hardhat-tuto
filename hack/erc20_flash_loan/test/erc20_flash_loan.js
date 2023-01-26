const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("Test erc 20 flash loan exploit", () => {

    let lending_pool, attacker, token;
    let lending_pool_deployed, attacker_deployed, token_deployed;

    let balance_attacker, balance_sc;


    it("Should drain all ERC20 tokens from the lending pool", async() => {

        token = await ethers.getContractFactory("TKN");
        lending_pool = await ethers.getContractFactory("LendingPool");
        attacker = await ethers.getContractFactory("LendingPoolExploit");

        token_deployed = await token.deploy();
        lending_pool_deployed = await lending_pool.deploy(token_deployed.address);
        attacker_deployed = await attacker.deploy(lending_pool_deployed.address);


        // Owner sends all his tokens to the lending pool for the test
        await token_deployed.transfer(lending_pool_deployed.address, 1000);

        balance_attacker = await token_deployed.balanceOf(attacker_deployed.address);
        balance_sc = await token_deployed.balanceOf(lending_pool_deployed.address);
        console.log("BEFORE EXPLOIT \nBal attacker : %s, bal SC : %s", balance_attacker, balance_sc);
        expect(balance_sc).to.equal(1000);
        expect(balance_attacker).to.equal(0);

        // Now the attack can start
        await attacker_deployed.pwn()

        balance_attacker = await token_deployed.balanceOf(attacker_deployed.address);
        balance_sc = await token_deployed.balanceOf(lending_pool_deployed.address);
        console.log("AFTER EXPLOIT \nBal attacker : %s, bal SC : %s", balance_attacker, balance_sc);        
        expect(balance_attacker).to.equal(1000);
        expect(balance_sc).to.equal(0);
    })
    

})