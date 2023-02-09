const {ethers} = require("hardhat");

async function main() {


    const NFT = await ethers.getContractFactory("SFT");
    const nft = await NFT.attach("0x6643fBC0D66fc580de15a0A0678D4c1f41b0071b");

    await(await nft.setPaused(false)).wait(2);

    await nft.mint(3,{value:ethers.utils.parseEther("0.03")});

}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});