const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("Test hack seven eth", () => {

    let seven_eth_contract, attacker_contract;
    let seven_eth_deployed, attacker_deployed;

    it("should hack and win eth from the seven_eth contract", async() => {

        seven_eth_contract = await ethers.getContractFactory("SevenEth");
        attacker_contract = await ethers.getContractFactory("SevenEthExploit");

        seven_eth_deployed = await seven_eth_contract.deploy();
        attacker_deployed = await attacker_contract.deploy(seven_eth_deployed.address);


        // Bob and Alice playing
        const [owner, alice, bob] = await ethers.getSigners();

        let contractAsAlice = seven_eth_deployed.connect(alice);
        let contractAsBob = seven_eth_deployed.connect(bob);

        await contractAsAlice.play({value:ethers.utils.parseEther("1.0")});
        await contractAsBob.play({value:ethers.utils.parseEther("1.0")});

        const balance_sc = await ethers.provider.getBalance(seven_eth_deployed.address);
        console.log(balance_sc);

        // Attacking the seven eth contract
        await attacker_deployed.pwn();
        const balance_attacker_sc = await ethers.provider.getBalance(seven_eth_deployed.address);
        console.log(balance_attacker_sc);

        // seven eth contract has been destructed
        await expect(ethers.provider.getBalance(seven_eth_deployed.address)).to.be.reverted;


    })

})