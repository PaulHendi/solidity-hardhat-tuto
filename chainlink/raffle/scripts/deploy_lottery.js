const {ethers} = require("hardhat");

async function main() {

    const [owner] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", owner.address);

    const lottery = await ethers.getContractFactory("Lottery");
    const lottery_deployed = await lottery.deploy();

    console.log("Lottery address:", lottery_deployed.address);


}


main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});