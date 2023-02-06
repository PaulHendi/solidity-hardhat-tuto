const {ethers} = require("hardhat");


async function main() {
    const Randomness = await ethers.getContractFactory("randomness");
    const randomness = await Randomness.deploy();
    
    await randomness.deployed();
    
    console.log("Randomness deployed to:", randomness.address);

    // Don't forget to send some LINK :)
}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});