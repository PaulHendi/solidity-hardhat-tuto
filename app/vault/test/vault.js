const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("Test vault", () => {

    let vault_contract, token_contract;
    let vault_contract_deployed, token_contract_deployed;

    let owner, alice, bob;
    let owner_addr, alice_addr, bob_addr;

    let vault_as_alice, vault_as_bob;
    let uni_as_alice, uni_as_bob;

    beforeEach(async() => {

        vault_contract = await ethers.getContractFactory("Vault");
        token_contract = await ethers.getContractFactory("UNI");

        token_contract_deployed = await token_contract.deploy();

        // Creation of the UNI vault
        vault_contract_deployed = await vault_contract.deploy(token_contract_deployed.address);

        // Get signers
        [owner, alice, bob] = await ethers.getSigners();
        alice_addr = await alice.getAddress();
        bob_addr = await bob.getAddress();

        // Owner transfer UNI token to bob and Alice for the tests
        await token_contract_deployed.transfer(alice_addr, 1000);
        await token_contract_deployed.transfer(bob_addr, 1000);

        // Connections to both contracts with Alice's and Bob's accounts
        vault_as_alice = await vault_contract_deployed.connect(alice);
        uni_as_alice = await token_contract_deployed.connect(alice);
        
        vault_as_bob = await vault_contract_deployed.connect(bob);
        uni_as_bob = await token_contract_deployed.connect(bob);

    })

    it("should test deposit and withdrawal of Bob and Alice and track the shares for each", async() => {


        // ----------- ALICE -------------
        // Alice approves spending of UNI from Vault contract
        await uni_as_alice.approve(vault_contract_deployed.address, 100);

        // Alice deposits 100 UNI in the vault
        await vault_as_alice.deposit(100);

        // Alice checks her shares
        let shares = await vault_as_alice.balanceOf(alice_addr);
        
        // It should be the whole supply of shares
        let total_supply = await vault_as_alice.totalSupply();
        expect(shares).to.equal(total_supply);

        
        // ----------- BOB -------------
        // Bob approves spending of UNI from Vault contract
        await uni_as_bob.approve(vault_contract_deployed.address, 100);

        // Bob deposits 100 UNI in the vault
        await vault_as_bob.deposit(100);

        // Bob checks her shares
        shares = await vault_as_bob.balanceOf(bob_addr);
        
        // It should be the whole supply of shares
        total_supply = await vault_as_bob.totalSupply();
        expect(shares/total_supply).to.equal(0.5);


        

    })

})