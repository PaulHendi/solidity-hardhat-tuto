const {ethers} = require("hardhat");

async function main() {
    
        const [owner] = await ethers.getSigners();
        
        const coin_flip = await ethers.getContractFactory("CoinFlip");
        const coin_flip_deployed = await coin_flip.attach("0xadE1eD0A46BBEde0525ef0179681Ee089344AA56");

        await coin_flip_deployed.play(0, {value: ethers.utils.parseEther("0.1"), gasLimit: 2500000});

}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
process.exit(1);
});