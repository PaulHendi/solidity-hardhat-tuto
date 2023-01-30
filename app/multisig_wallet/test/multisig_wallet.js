const {expect} = require('chai');
const {ethers} = require('hardhat');
const { Contract } = require('hardhat/internal/hardhat-network/stack-traces/model');

describe('MultisigWallet', function () {

    let MultisigWallet;
    let multisigWallet_deployed;

    let owner, alice, bob, carol, jack, dave;
    let owner_address, alice_address, bob_address, carol_address, jack_address, dave_address;

    beforeEach(async function () {

        // Note that there are many tests that we won't do here (e.g. testing the require statements in the constructor)
        // Here we assume that the constructor works as expected
        // Besides we will tests simple transactions between users, but we could tests smart contract interactions as well

        [owner, alice, bob, carol, jack, dave] = await ethers.getSigners();
        owner_address = await owner.getAddress();
        alice_address = await alice.getAddress();
        bob_address = await bob.getAddress();
        carol_address = await carol.getAddress();
        jack_address = await jack.getAddress();
        dave_address = await dave.getAddress();
        
        const all_users = [owner_address, alice_address, bob_address, carol_address, jack_address, dave_address];

        MultisigWallet = await ethers.getContractFactory('MultiSigWallet');
        multisigWallet_deployed = await MultisigWallet.deploy(all_users, 3);

        // Send some initial funds to the contract
        await owner.sendTransaction({to: multisigWallet_deployed.address, value: ethers.utils.parseEther("10.0")});

        // Check that the contract has the correct balance
        expect(await ethers.provider.getBalance(multisigWallet_deployed.address)).to.equal(ethers.utils.parseEther("10.0"));

    });

    it("Should create a tx, to send 1 ETH to Dave, and wait for confirmations", async() => {
    
        // Dave create the transaction
        wallet_as_dave = multisigWallet_deployed.connect(dave);
        await wallet_as_dave.submit(dave_address, ethers.utils.parseEther("5.0"), []);
        
        // Check that the transaction is in the pending list
        tx = await wallet_as_dave.transactions(0);
        console.log(tx);

        // Check that the function cannot be executed yet
        await expect(wallet_as_dave.execute(0)).to.be.revertedWith("approvals < required");

        // Alice approves the transaction
        wallet_as_alice = multisigWallet_deployed.connect(alice);
        await wallet_as_alice.approve(0);

        // Bob approves the transaction
        wallet_as_bob = multisigWallet_deployed.connect(bob);
        await wallet_as_bob.approve(0);

        // Check that the transaction cannot be executed yet
        await expect(wallet_as_dave.execute(0)).to.be.revertedWith("approvals < required");

        // Carol approves the transaction
        wallet_as_carol = multisigWallet_deployed.connect(carol);
        await wallet_as_carol.approve(0);

        // Get the balance of Dave before the transaction
        let balance_before = await ethers.provider.getBalance(dave_address);

        // Check that the transaction can be executed
        await wallet_as_dave.execute(0);

        // Get the balance of Dave after the transaction
        let balance_after = await ethers.provider.getBalance(dave_address);

        // Check that the transaction was executed correctly
        console.log("Balance before: %s",ethers.utils.formatEther(balance_before.toString()));
        console.log("Balance after: %s",ethers.utils.formatEther(balance_after.toString()));


    });

    // TODO : Add more tests (below tests suggested by Copilot :) )
    // Check all the require statements (owner rights)
    // Check that the transaction cannot be executed twice
    // Check that the transaction cannot be approved twice
    // Check that the transaction cannot be approved by a non-owner
    // Check that the transaction cannot be created by a non-owner
    // Check that the transaction cannot be created with an invalid destination address
    

});