const {ethers} = require("hardhat");

async function main() {

    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    
    console.log("Account balance:", (await deployer.getBalance()).toString());
    
    const SFT = await ethers.getContractFactory("SFT");
    const sft = await SFT.deploy("https://gateway.pinata.cloud/ipfs/QmQRpDw3QVP3AzwMMFowgkEWhmvMvdaaKZNrxs41VziL5B/1.json");

    console.log("NFT address:", sft.address);

}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});