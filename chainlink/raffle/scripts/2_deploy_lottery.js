const {ethers} = require("hardhat");

async function main() {

    const [owner] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", owner.address);

    const lottery = await ethers.getContractFactory("Lottery");

    // Deploy using the address of the random number generator
    const lottery_deployed = await lottery.deploy("0x95A5976ae8899e352364975F083182bFD0a8c63b");

    console.log("Lottery address:", lottery_deployed.address);


}


main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});