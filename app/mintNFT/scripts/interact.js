const {ethers} = require("hardhat");

async function main() {


    const NFT = await ethers.getContractFactory("NftLowerGas");
    const nft = await NFT.attach("0x1DA505C8D4BAab63ca7b3BE841b1cB12Be1dfC09");

    await(await nft.setPaused(false)).wait(2);

    await nft.mint(1,{value:ethers.utils.parseEther("0.01")});

}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});