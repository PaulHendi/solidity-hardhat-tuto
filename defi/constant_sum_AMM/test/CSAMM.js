const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("CSAMM", function() {

    let token_1, token_2, CSAMM;
    let token_1_deployed, token_2_deployed, CSAMM_deployed;
    let owner, alice, bob;

    beforeEach(async function() {
        
        [owner, alice, bob] = await ethers.getSigners();

        token_1 = await ethers.getContractFactory("ERC20");
        token_2 = await ethers.getContractFactory("ERC20");
        CSAMM = await ethers.getContractFactory("CSAMM");

        // Deploy all the contracts
        token_1_deployed = await token_1.deploy("Token 1", "TK1");
        token_2_deployed = await token_2.deploy("Token 2", "TK2");
        CSAMM_deployed = await CSAMM.deploy(token_1_deployed.address, token_2_deployed.address);

        // Transfer 200 tokens TK1 to Alice and Bob
        await token_1_deployed.transfer(alice.address, 200);
        await token_1_deployed.transfer(bob.address, 200);

        // Transfer 200 tokens TK2 to Alice and Bob
        await token_2_deployed.transfer(alice.address, 200);
        await token_2_deployed.transfer(bob.address, 200);

        // Check the balances of Alice, bob and the owner
        let balance_1_Alice = await token_1_deployed.balanceOf(alice.address);
        let balance_2_Alice = await token_2_deployed.balanceOf(alice.address);

        let balance_1_Bob = await token_1_deployed.balanceOf(bob.address);
        let balance_2_Bob = await token_2_deployed.balanceOf(bob.address);

        let balance_1_owner = await token_1_deployed.balanceOf(owner.address);
        let balance_2_owner = await token_2_deployed.balanceOf(owner.address);

        console.log("Alice's balance of TK1: ", balance_1_Alice.toString());
        console.log("Alice's balance of TK2: ", balance_2_Alice.toString());

        console.log("Bob's balance of TK1: ", balance_1_Bob.toString());
        console.log("Bob's balance of TK2: ", balance_2_Bob.toString());

        console.log("Owner's balance of TK1: ", balance_1_owner.toString());
        console.log("Owner's balance of TK2: ", balance_2_owner.toString()); 

    })

    it("should add liquidity perform swap and remove liquidity", async function() {

        // Owner adds liquidity
        await token_1_deployed.approve(CSAMM_deployed.address, 300);
        await token_2_deployed.approve(CSAMM_deployed.address, 150);

        await CSAMM_deployed.addLiquidity(300, 150);

        // Check the balances of the owner
        let shares_owner = await CSAMM_deployed.balanceOf(owner.address);
        console.log("Owner's shares: ", shares_owner.toString());



        // Alice adds liquidity
        await token_1_deployed.connect(alice).approve(CSAMM_deployed.address, 100);
        await token_2_deployed.connect(alice).approve(CSAMM_deployed.address, 100);

        await CSAMM_deployed.connect(alice).addLiquidity(100, 50);

        // Check the balances of Alice
        let shares_Alice = await CSAMM_deployed.balanceOf(alice.address);
        console.log("Alice's shares: ", shares_Alice.toString());

        // Bob adds liquidity
        await token_1_deployed.connect(bob).approve(CSAMM_deployed.address, 200);
        await token_2_deployed.connect(bob).approve(CSAMM_deployed.address, 100);

        await CSAMM_deployed.connect(bob).addLiquidity(200, 100);

        // Check the balances of Bob
        let shares_Bob = await CSAMM_deployed.balanceOf(bob.address);
        console.log("Bob's shares: ", shares_Bob.toString());


        // Alice swaps 50 TK1 for TK2
        await token_1_deployed.connect(alice).approve(CSAMM_deployed.address, 50);
        await CSAMM_deployed.connect(alice).swap(token_1_deployed.address,50);

        // Check the balances of Alice
        let balance_1_Alice = await token_1_deployed.balanceOf(alice.address);
        let balance_2_Alice = await token_2_deployed.balanceOf(alice.address);

        console.log("Alice's balance of TK1: ", balance_1_Alice.toString());
        console.log("Alice's balance of TK2: ", balance_2_Alice.toString());

        // Bob swaps 50 TK2 for TK1
        await token_2_deployed.connect(bob).approve(CSAMM_deployed.address, 50);
        await CSAMM_deployed.connect(bob).swap(token_2_deployed.address,50);

        // Check the balances of Bob
        let balance_1_Bob = await token_1_deployed.balanceOf(bob.address);
        let balance_2_Bob = await token_2_deployed.balanceOf(bob.address);

        console.log("Bob's balance of TK1: ", balance_1_Bob.toString());
        console.log("Bob's balance of TK2: ", balance_2_Bob.toString());

        // Check reserves
        let reserve_1 = await CSAMM_deployed.reserve0();
        let reserve_2 = await CSAMM_deployed.reserve1();

        console.log("Reserve 1: ", reserve_1.toString());
        console.log("Reserve 2: ", reserve_2.toString());

        // Owner swaps 300 TK1 for TK2
        await token_1_deployed.approve(CSAMM_deployed.address, 300);
        await CSAMM_deployed.swap(token_1_deployed.address,300);

        // Check the balances of the owner
        let balance_1_owner = await token_1_deployed.balanceOf(owner.address);
        let balance_2_owner = await token_2_deployed.balanceOf(owner.address);

        console.log("Owner's balance of TK1: ", balance_1_owner.toString());
        console.log("Owner's balance of TK2: ", balance_2_owner.toString());

        // Check reserves
        reserve_1 = await CSAMM_deployed.reserve0();
        reserve_2 = await CSAMM_deployed.reserve1();

        console.log("Reserve 1: ", reserve_1.toString());
        console.log("Reserve 2: ", reserve_2.toString());


        // Owner removes liquidity
        await CSAMM_deployed.removeLiquidity(shares_owner);

        // Check the balances of the owner
        balance_1_owner = await token_1_deployed.balanceOf(owner.address);
        balance_2_owner = await token_2_deployed.balanceOf(owner.address);

        console.log("Owner's balance of TK1: ", balance_1_owner.toString());
        console.log("Owner's balance of TK2: ", balance_2_owner.toString());


        // Alice removes liquidity
        await CSAMM_deployed.connect(alice).removeLiquidity(shares_Alice);

        // Check the balances of Alice
        balance_1_Alice = await token_1_deployed.balanceOf(alice.address);
        balance_2_Alice = await token_2_deployed.balanceOf(alice.address);

        console.log("Alice's balance of TK1: ", balance_1_Alice.toString());
        console.log("Alice's balance of TK2: ", balance_2_Alice.toString());

        // Bob removes liquidity
        await CSAMM_deployed.connect(bob).removeLiquidity(shares_Bob);

        // Check the balances of Bob
        balance_1_Bob = await token_1_deployed.balanceOf(bob.address);
        balance_2_Bob = await token_2_deployed.balanceOf(bob.address);

        console.log("Bob's balance of TK1: ", balance_1_Bob.toString());
        console.log("Bob's balance of TK2: ", balance_2_Bob.toString());

    });

})