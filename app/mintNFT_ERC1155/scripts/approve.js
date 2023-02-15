const {ethers} = require("hardhat");

async function main() {


    const NFT = await ethers.getContractFactory("SFT");
    const nft = await NFT.attach("0x6643fBC0D66fc580de15a0A0678D4c1f41b0071b");


    await nft.setApprovalForAll("0x732Bc68358d66e719c21AA6EC92ED4D7fDe337B9", true);

}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});