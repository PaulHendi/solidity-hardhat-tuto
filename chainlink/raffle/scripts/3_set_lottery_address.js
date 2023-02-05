const {ethers} = require("hardhat");


async function main() {


    const [owner] = await ethers.getSigners();

    console.log("Setting the addresse with the account:", owner.address);

    const randomness = await ethers.getContractFactory("RandomNumberConsumer");
    const randomness_deployed = await randomness.attach("0x95A5976ae8899e352364975F083182bFD0a8c63b");

    await randomness_deployed.set_lottery_contract("0x15b2e953aE27aacDe70D9bc6BBb2A26467D6EAFD");
    

}


main().then(() => process.exit(0)).catch(error => {process.exit(1)});