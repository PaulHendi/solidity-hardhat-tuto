const {ethers} = require("hardhat");


async function main() {

    const uniswap_singleswap = await ethers.getContractFactory("UniswapV2SingleSwap");
    const uniswap_singleswap_deployed = await uniswap_singleswap.attach("0x589b69569F830eb70f180Fc74d3123e517Abda59");

    await uniswap_singleswap_deployed.swapSingleExactAmountIn(ethers.utils.parseEther("0.1"), 0, {gasLimit: 2500000});

}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});