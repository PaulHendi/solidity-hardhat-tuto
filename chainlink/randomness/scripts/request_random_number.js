const {ethers } = require("hardhat");


async function main() {

    // Retrieve the deployed contract (at address 0x7a689cEbeEfeEF00d94893175970DC08bA0772E7)
    const Randomness = await ethers.getContractFactory("RandomNumber");
    const randomness = await Randomness.attach("0x7a689cEbeEfeEF00d94893175970DC08bA0772E7");

    // Call the contract's getNumber function
    await randomness.getRandomNumber();

    }


main().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
    }
);