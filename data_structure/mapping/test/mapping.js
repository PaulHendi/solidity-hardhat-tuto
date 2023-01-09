const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("Test mapping", ()=> {

    let contract;
    let contractDeployed;

    let owner_address;
    let alice_address;
    let bob_address;

    beforeEach(async() => {

        contract = await ethers.getContractFactory("MappingBasic");
        contractDeployed = await contract.deploy();

        const [owner, alice, bob] = await ethers.getSigners();
        owner_address = await owner.getAddress();
        alice_address = await alice.getAddress();
        bob_address = await bob.getAddress();        

    })

    it("should check that initial balances are 0", async  () => {



        let balance_owner = await contractDeployed.get(owner_address);
        let balance_alice = await contractDeployed.get(alice_address);
        let balance_bob = await contractDeployed.get(bob_address);

        expect(balance_owner).to.equal(0);
        expect(balance_alice).to.equal(0);
        expect(balance_bob).to.equal(0);


    })


    it("shoud set balances of owner, alice and bob", async() => {


        await contractDeployed.set(owner_address, 50);
        await contractDeployed.set(alice_address, 10);
        await contractDeployed.set(bob_address, 20);        

        let balance_owner = await contractDeployed.get(owner_address);
        let balance_alice = await contractDeployed.get(alice_address);
        let balance_bob = await contractDeployed.get(bob_address);

        expect(balance_owner).to.equal(50);
        expect(balance_alice).to.equal(10);
        expect(balance_bob).to.equal(20);        


    })


    it("should set balances and clear the one of alice", async() => {


        await contractDeployed.set(owner_address, 50);
        await contractDeployed.set(alice_address, 10);
        await contractDeployed.set(bob_address, 20);    
        
        await contractDeployed.remove(alice_address);

        let balance_owner = await contractDeployed.get(owner_address);
        let balance_alice = await contractDeployed.get(alice_address);
        let balance_bob = await contractDeployed.get(bob_address);

        expect(balance_owner).to.equal(50);
        expect(balance_alice).to.equal(0);
        expect(balance_bob).to.equal(20);            

    })


})