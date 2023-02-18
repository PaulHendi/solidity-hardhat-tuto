const {ethers} = require("hardhat");

async function main() {

    coin_flip = await ethers.getContractFactory("CoinFlip");
    coin_flip_deployed = await coin_flip.attach("0x41a211720563334c4026E604Bb16274E6178C3c2");

    // Withdraw all the funds from the contract
    await coin_flip_deployed.withdraw();

}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});