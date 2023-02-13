const {ethers} = require("hardhat");

async function main() {
    
        const [owner] = await ethers.getSigners();
        
        const coin_flip = await ethers.getContractFactory("CoinFlip");
        const coin_flip_deployed = await coin_flip.attach("0xBa962CdB7f12d60ECB198E8710DE7A401493E485");

        await coin_flip_deployed.play(0, {value: ethers.utils.parseEther("0.1"), gasLimit: 2500000});

}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
process.exit(1);
});