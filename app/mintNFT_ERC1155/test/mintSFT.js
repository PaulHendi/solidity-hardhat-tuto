const {ethers} = require("hardhat");
const { expect } = require("chai");

describe("SFT", function() {

    let sft, sft_deployed;

    let owner, alice, bob;

    beforeEach(async function() {
            
        provider =  new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/fantom_testnet");

        owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        alice = new ethers.Wallet(process.env.PRIVATE_KEY_ALICE, provider);
        bob = new ethers.Wallet(process.env.PRIVATE_KEY_BOB, provider);

        sft = await ethers.getContractFactory("Obake");
        sft_deployed = await sft.deploy("https://gateway.pinata.cloud/ipfs/QmQRpDw3QVP3AzwMMFowgkEWhmvMvdaaKZNrxs41VziL5B/1.json");

        await sft_deployed.deployed();

    });

    // Additional tests : 
    // - Name and symbol of the token visible on the explorer, yes
    // - Image accessible on a markeplace, yes (tested on opensea)
    // - Metadata accessible on a marketplace, yes (tested on opensea)


    it("Tests minting of SFT", async function() {

        // First step : The owner unpause the contract 
        await(await sft_deployed.setPaused(false)).wait(2);

        // Alice mints 1 SFT
        await(await sft_deployed.connect(alice).mint(1, {value: ethers.utils.parseEther("0.01")})).wait(2);

        // Alice checks her balance
        let alice_balance = await sft_deployed.balanceOf(alice.address, 1); // 1 is the token id
        expect(alice_balance.toString()).to.equal("1");

        // Check the supply
        let supply = await sft_deployed.supply();
        expect(supply).to.equal(1);


        // Bob mints 3 SFT
        await(await sft_deployed.connect(bob).mint(3, {value: ethers.utils.parseEther("0.03")})).wait(2);

        // Check the supply
        supply = await sft_deployed.supply();
        expect(supply).to.equal(4);

    });


    // it("should test requires", async function() {
    
    //     // Alice tries to mint, but the contract is paused
    //     await expect(sft_deployed.connect(alice).mint(1, {value: ethers.utils.parseEther("0.1")})).to.be.reverted;

    //     // Alice tries to mint, but she doesn't have enough funds
    //     await(await sft_deployed.setPaused(false)).wait(2);
    //     await expect(sft_deployed.connect(alice).mint(1, {value: ethers.utils.parseEther("0.001")})).to.be.reverted;

    //     // Alice mints 6 SFT
    //     await(await sft_deployed.connect(alice).mint(6, {value: ethers.utils.parseEther("0.06")})).wait(2);

    //     // Need to test the amount available before sold out

    //     // Need to test the setter as well


    // });

});