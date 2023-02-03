const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("DiscreteRewards", function () {

    let stakingToken, rewardToken, stakingRewards;
    let stakingToken_deployed, rewardToken_deployed, stakingRewards_deployed;

    let owner, alice, bob;

    beforeEach(async function () {
    
        stakingToken = await ethers.getContractFactory("ERC20");
        rewardToken = await ethers.getContractFactory("ERC20");
        stakingRewards = await ethers.getContractFactory("DiscreteStakingRewards");

        stakingToken_deployed = await stakingToken.deploy("Staking Token", "STK");
        rewardToken_deployed = await rewardToken.deploy("Reward Token", "RWD");
        stakingRewards_deployed = await stakingRewards.deploy(stakingToken_deployed.address, rewardToken_deployed.address);

        [owner, alice, bob] = await ethers.getSigners();

        // Owner sends 200 STK to Alice and Bob
        await stakingToken_deployed.transfer(alice.address, 200);
        await stakingToken_deployed.transfer(bob.address, 200);

        // Owner sends 100 RWD to StakingRewards contract
        await rewardToken_deployed.transfer(stakingRewards_deployed.address, 100);

    
    });


    it("should check balances of everyone before starting", async function () {

        expect(await stakingToken_deployed.balanceOf(alice.address)).to.equal(200);
        expect(await stakingToken_deployed.balanceOf(bob.address)).to.equal(200);
        expect(await rewardToken_deployed.balanceOf(stakingRewards_deployed.address)).to.equal(100);


    });


    it("should start staking", async function () {

        // Alice and Bob approve StakingRewards contract to spend their STK
        await stakingToken_deployed.connect(alice).approve(stakingRewards_deployed.address, 200);
        await stakingToken_deployed.connect(bob).approve(stakingRewards_deployed.address, 200);

        // Alice and Bob stake 100 STK each
        await stakingRewards_deployed.connect(alice).stake(100);
        await stakingRewards_deployed.connect(bob).stake(100);

        // Check balances
        expect(await stakingToken_deployed.balanceOf(alice.address)).to.equal(100);
        expect(await stakingToken_deployed.balanceOf(bob.address)).to.equal(100);
        expect(await stakingToken_deployed.balanceOf(stakingRewards_deployed.address)).to.equal(200);



    });

});