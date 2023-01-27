const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("Test guess the number attack", () => {

    let guess, attacker;
    let guess_deployed, attacker_deployed;

    it("should guess the number by generating the pseudo random number", async() => {

        guess = await ethers.getContractFactory("GuessTheRandomNumber");
        attacker = await ethers.getContractFactory("Attack");

        guess_deployed = await guess.deploy({value:ethers.utils.parseEther("1.0")});
        attacker_deployed = await attacker.deploy();

        balance_guess = await ethers.provider.getBalance(guess_deployed.address);
        balance_attacker = await ethers.provider.getBalance(attacker_deployed.address);
        console.log("Before the exploit :\n  balance guess : %s\n  balance attacker : %s",
                    ethers.utils.formatEther(balance_guess),
                    ethers.utils.formatEther(balance_attacker));

        await attacker_deployed.attack(guess_deployed.address);

        balance_guess = await ethers.provider.getBalance(guess_deployed.address);
        balance_attacker = await ethers.provider.getBalance(attacker_deployed.address);
        console.log("After the exploit :\n  balance guess : %s\n  balance attacker : %s",
                    ethers.utils.formatEther(balance_guess),
                    ethers.utils.formatEther(balance_attacker));       

    })

})