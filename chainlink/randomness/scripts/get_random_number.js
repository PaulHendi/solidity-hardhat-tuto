const {ethers } = require("hardhat");


async function main() {

    // Retrieve the deployed contract (at address 0x7a689cEbeEfeEF00d94893175970DC08bA0772E7)
    const Randomness = await ethers.getContractFactory("RandomNumber");
    const randomness = await Randomness.attach("0x7a689cEbeEfeEF00d94893175970DC08bA0772E7");


    // Get the random number
    const randomNumber = await randomness.randomResult();
    console.log("Random number:", randomNumber.toString());


    }


main().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
    }
);