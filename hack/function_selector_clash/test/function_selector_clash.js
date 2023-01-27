const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("Test function selector clash", () => {

    let fc_clash, attacker;
    let fc_clash_deployed, attacker_deployed;

    it("should attack function selector by providing an equal funcction selector and transfering all balance to the attacker", async() => {

        fc_clash = await ethers.getContractFactory("FunctionSelectorClash");
        attacker = await ethers.getContractFactory("FunctionSelectorClashExploit");

        fc_clash_deployed = await fc_clash.deploy({value:ethers.utils.parseEther("1.0")});
        attacker_deployed = await attacker.deploy(fc_clash_deployed.address);

        balance_fc_clash = await ethers.provider.getBalance(fc_clash_deployed.address);
        balance_attacker = await ethers.provider.getBalance(attacker_deployed.address);
        console.log("Before the exploit :\n  balance fc clash : %s\n  balance attacker : %s",
                    ethers.utils.formatEther(balance_fc_clash),
                    ethers.utils.formatEther(balance_attacker));

        await attacker_deployed.pwn();

        balance_fc_clash = await ethers.provider.getBalance(fc_clash_deployed.address);
        balance_attacker = await ethers.provider.getBalance(attacker_deployed.address);
        console.log("After the exploit :\n  balance fc clash : %s\n  balance attacker : %s",
                    ethers.utils.formatEther(balance_fc_clash),
                    ethers.utils.formatEther(balance_attacker));       

    })

})