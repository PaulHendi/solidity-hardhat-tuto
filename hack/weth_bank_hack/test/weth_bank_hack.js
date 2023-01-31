const {ethers} = require("hardhat");
const { expect } = require("chai");

describe("Test WETH Bank Hack", () => {

    let weth, wethBank, wethBankHack;
    let weth_deployed, wethBank_deployed, wethBankHack_deployed;

    let owner, alice;
    let owner_address, alice_address;

    before(async () => {
    
        weth = await ethers.getContractFactory("WETH");
        wethBank = await ethers.getContractFactory("ERC20Bank");
        wethBankHack = await ethers.getContractFactory("ERC20BankExploit");

        weth_deployed = await weth.deploy();
        wethBank_deployed = await wethBank.deploy(weth_deployed.address);
        wethBankHack_deployed = await wethBankHack.deploy(wethBank_deployed.address);

        [owner, alice] = await ethers.getSigners();
        owner_address = await owner.getAddress();
        alice_address = await alice.getAddress();

        // Alice has 11 WETH in her wallet
        weth_as_alice = weth_deployed.connect(alice);
        await weth_as_alice.deposit({value:ethers.utils.parseEther("11.0")});

        // Checking Alice's balance
        alice_balance = await weth_as_alice.balanceOf(alice_address);
        expect(alice_balance).to.equal(ethers.utils.parseEther("11.0"));

    });


    it("should test the hack of alice's wallet", async () => {

        // TODO : check the permit function that is maybe missing

    });
});