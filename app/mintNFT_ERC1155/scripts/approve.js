const {ethers} = require("hardhat");

async function main() {


    const NFT = await ethers.getContractFactory("SFT");
    const nft = await NFT.attach("0x6643fBC0D66fc580de15a0A0678D4c1f41b0071b");


    await nft.setApprovalForAll("0x081801d6Ff087688e6C156AAc9e3FBDc7740441C", true);

}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});