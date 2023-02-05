const {ethers} = require("hardhat");

async function main() {

    const [owner] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", owner.address);

    const randomness = await ethers.getContractFactory("RandomNumberConsumer");
    const randomness_deployed = await randomness.deploy();

    console.log("Random number generator address:", randomness_deployed.address);


}


main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});