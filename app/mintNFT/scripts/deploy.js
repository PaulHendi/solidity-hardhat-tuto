const {ethers} = require("hardhat");

async function main() {

    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    
    console.log("Account balance:", (await deployer.getBalance()).toString());
    
    const NFT = await ethers.getContractFactory("NftLowerGas");
    const nft = await NFT.deploy("BabyMonkeys","KEYS","https://gateway.pinata.cloud/ipfs/QmXGc3y8zfW3PzpPQyAKZFXzY96Q7QqNuisQRjzgoMw5tE/");

    console.log("NFT address:", nft.address);

}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});