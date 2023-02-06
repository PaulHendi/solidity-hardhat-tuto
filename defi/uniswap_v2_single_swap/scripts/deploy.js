const {ethers} = require("hardhat");


async function main() {
    
        const [owner] = await ethers.getSigners();
    
        console.log("Deploying contracts with the account:", owner.address);
    
        // 1) Deploy the UniswapV2Factory contract
        const uniswap_singleswap = await ethers.getContractFactory("UniswapV2SingleSwap");
        const uniswap_singleswap_deployed = await uniswap_singleswap.deploy();
    
        console.log("UniswapV2Factory address:", uniswap_singleswap_deployed.address);

}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});