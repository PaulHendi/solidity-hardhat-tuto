const {ethers} = require("hardhat");


async function main() {

    const [owner] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", owner.address);

    console.log("Account balance:", (await owner.getBalance()).toString());

    const StakingRewards = await ethers.getContractFactory("StakingRewards");

    // The constructor args will need to be the address of the SFT contract
    const stakingRewards = await StakingRewards.deploy("0x6643fBC0D66fc580de15a0A0678D4c1f41b0071b");

    console.log("StakingRewards deployed to:", stakingRewards.address)


}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});