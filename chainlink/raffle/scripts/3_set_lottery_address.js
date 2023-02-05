const {ethers} = require("hardhat");


async function main() {


    const [owner] = await ethers.getSigners();

    console.log("Setting the address with the account:", owner.address);

    const randomness = await ethers.getContractFactory("RandomNumberConsumer");
    const randomness_deployed = await randomness.attach("0x29Fd00FA40c90aec39AC604D875907874f237baA");

    await randomness_deployed.set_lottery_contract("0xb35A5c834c8C4e4f17d51Da207E4684FAd6DA2f6");
    

}


main().then(() => process.exit(0)).catch(error => {process.exit(1)});