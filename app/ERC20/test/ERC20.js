const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("Test ERC20", () => {

    let contract;
    let contractDeployed;

    let owner, alice, bob;
    let owner_address, alice_address, bob_address;

    beforeEach(async() => {

        contract = await ethers.getContractFactory("ERC20");
        contractDeployed = await contract.deploy();

        [owner, alice, bob] = await ethers.getSigners();
        owner_address = await owner.getAddress();
        alice_address = await alice.getAddress();
        bob_address = await bob.getAddress();

    })

    it("should test the total supply", async() => {

        const total_supply = await contractDeployed.totalSupply();
        expect(total_supply).to.equal(1000);
        
    })

    it("should test initial balance of owner", async () => {

        const balance = await contractDeployed.balanceOf(owner_address);
        const total_supply = await contractDeployed.totalSupply();
        expect(total_supply).to.equal(balance);

    })

    it("should test mint and burn with owner's account", async() => {

        let amount = 1000;
        await contractDeployed.mint(amount);

        let total_supply = await contractDeployed.totalSupply();
        expect(total_supply).to.equal(2000);

        amount = 500;
        await contractDeployed.burn(amount);

        total_supply = await contractDeployed.totalSupply();
        expect(total_supply).to.equal(1500);        


    })

    it("Should test mint and burn with alice's account", async() => {

        let contractAsAlice = contractDeployed.connect(alice)
        let amount = 1000;
        await contractAsAlice.mint(amount);

        let total_supply = await contractAsAlice.totalSupply();
        expect(total_supply).to.equal(2000);

        amount = 500;
        await contractAsAlice.burn(amount);

        total_supply = await contractAsAlice.totalSupply();
        expect(total_supply).to.equal(1500);            

    })


    it("should test simple transfer between owner, alice and bob", async() => {


        //Owner transfer to alice and bob
        let amount_for_alice = 100;
        let amount_for_bob = 50;
        await contractDeployed.transfer(alice_address, amount_for_alice);
        await contractDeployed.transfer(bob_address, amount_for_bob);

        // Checking the balances
        let balance_owner = await contractDeployed.balanceOf(owner_address);
        let balance_alice = await contractDeployed.balanceOf(alice_address);
        let balance_bob = await contractDeployed.balanceOf(bob_address);

        expect(balance_owner).to.equal(850);
        expect(balance_alice).to.equal(100);
        expect(balance_bob).to.equal(50);

        // Alice transfer to owner and bob
        let amount_for_owner = 30;
        amount_for_bob = 20;
        const contractAsAlice = await contractDeployed.connect(alice);
        await contractAsAlice.transfer(owner_address, amount_for_owner);
        await contractAsAlice.transfer(bob_address, amount_for_bob);

        // Checking the balances
        balance_owner = await contractAsAlice.balanceOf(owner_address);
        balance_alice = await contractAsAlice.balanceOf(alice_address);
        balance_bob = await contractAsAlice.balanceOf(bob_address);

        expect(balance_owner).to.equal(880);
        expect(balance_alice).to.equal(50);
        expect(balance_bob).to.equal(70);


        // Bob transfers back to Alice but too much at first
        amount_for_alice = 100;
        const contractAsBob = contractDeployed.connect(bob);
        await expect(contractAsBob.transfer(alice_address, amount_for_alice)).to.be.reverted;

        // Then corrects the amount
        amount_for_alice = 10;
        await contractAsBob.transfer(alice_address, amount_for_alice);

        // Checking the balances
        balance_owner = await contractAsAlice.balanceOf(owner_address);
        balance_alice = await contractAsAlice.balanceOf(alice_address);
        balance_bob = await contractAsAlice.balanceOf(bob_address);

        expect(balance_owner).to.equal(880);
        expect(balance_alice).to.equal(60);
        expect(balance_bob).to.equal(60);        

    })


    it("should test transferFrom, owner spending on behalf of Alice", async() => {

        // First transfer some funds to Alice
        await contractDeployed.transfer(alice_address, 100);
        let balance_alice = await contractDeployed.balanceOf(alice_address);
        expect(balance_alice).to.equal(100);

        // Then Alice approves spending of 10 by owner
        const contractAsAlice = await contractDeployed.connect(alice);

        let amount_allowed = 10
        await contractAsAlice.approve(owner_address, amount_allowed);

        // Then owner spend alice's funds to send them to Bob
        await contractDeployed.transferFrom(alice_address, bob_address, amount_allowed);

        balance_alice = await contractDeployed.balanceOf(alice_address);
        balance_bob = await contractDeployed.balanceOf(bob_address);
        expect(balance_alice).to.equal(90);
        expect(balance_bob).to.equal(10);


    })

    it("should fail transferFrom if no approve was done beforehand", async() => {

        // First transfer some funds to Alice
        await contractDeployed.transfer(alice_address, 100);
        let balance_alice = await contractDeployed.balanceOf(alice_address);
        expect(balance_alice).to.equal(100);


        // Then owner spend alice's funds to send them to Bob
        await expect(contractDeployed.transferFrom(alice_address, bob_address, 10)).to.be.reverted;

    })

})