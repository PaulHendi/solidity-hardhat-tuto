const {ethers} = require("hardhat");

async function main() {
    
        const [owner] = await ethers.getSigners();
        
        const coin_flip = await ethers.getContractFactory("CoinFlip");
        const coin_flip_deployed = await coin_flip.attach("0x625a00FD8B9a36d4d308FF23FC767FECF32EB5e3");

        await coin_flip_deployed.play(0, {value: ethers.utils.parseEther("0.1"), gasLimit: 2500000});

}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
process.exit(1);
});