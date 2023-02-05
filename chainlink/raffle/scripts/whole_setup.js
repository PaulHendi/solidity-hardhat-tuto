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


    // 2) Deploy lottery using the address of the random number generator
    const lottery = await ethers.getContractFactory("Lottery");
    const lottery_deployed = await lottery.deploy(randomness_deployed.address);

    console.log("Lottery address:", lottery_deployed.address);  

    // Wait for the transaction to be confirmed (5 confirmations)
    await lottery_deployed.deployTransaction.wait(5)

    
    // 3) Set the lottery address in the random number consumer
    await randomness_deployed.set_lottery_contract(lottery_deployed.address);

    // Don't forget to fund the randomness contract with LINK tokens :)

}


main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});