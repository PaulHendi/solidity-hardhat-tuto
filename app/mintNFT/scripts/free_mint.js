const {ethers} = require("hardhat");

async function main() {

    [deployer] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("NftLowerGas");
    const nft = await NFT.attach("0x8981be63E9E549F78ba21D994fCc8A8Ff176A701");

    await nft.mintForAddress(1, deployer.address);

}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});