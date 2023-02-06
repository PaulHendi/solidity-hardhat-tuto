const {ethers} = require("hardhat");

async function main() {

    const [owner] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", owner.address);

    // 1) Deploy randomness
    const randomness = await ethers.getContractFactory("RandomNumberConsumer");
    const randomness_deployed = await randomness.deploy();

    console.log("Random number generator address:", randomness_deployed.address);

    // Wait for the transaction to be confirmed (5 confirmations)
    await randomness_deployed.deployTransaction.wait(5)


    // 2) Deploy CoinFlip using the address of the random number generator
    const coin_flip = await ethers.getContractFactory("CoinFlip");
    const coin_flip_deployed = await coin_flip.deploy(randomness_deployed.address);

    console.log("CoinFlip address:", coin_flip_deployed.address);  

    // Wait for the transaction to be confirmed (5 confirmations)
    await coin_flip_deployed.deployTransaction.wait(5)

    
    // 3) Set the coin_flip address in the random number consumer
    await randomness_deployed.set_flip_contract(coin_flip_deployed.address);

    // Don't forget to fund the randomness contract with LINK tokens :)

}


main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});