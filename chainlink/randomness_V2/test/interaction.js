const {ethers} = require("hardhat");

async function main() {
    const Randomness = await ethers.getContractFactory("randomness");
    const randomness = await Randomness.attach("0xfA78256C63fcc6f09f2997Ccef94931904F6b8E0");
        

    await (await randomness.requestRandomWords({gasLimit: 2500000})).wait(10);
    const rand = await randomness.getRandomNumber();
    console.log(rand);
}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});

