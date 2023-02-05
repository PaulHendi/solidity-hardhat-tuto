const {ethers} = require("hardhat");

async function main() {
    const Randomness = await ethers.getContractFactory("randomness");
    const randomness = await Randomness.attach("0xE157cCeC2f3BF24bc3A084Cec68170Cf75895386");
        
    const request_id = await randomness.requestRandomWords({gasLimit: 10000000});

    console.log(request_id);
}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});