const {ethers} = require("hardhat");


async function main() {

    const uniswap_singleswap = await ethers.getContractFactory("UniswapV2SingleSwap");
    const uniswap_singleswap_deployed = await uniswap_singleswap.attach("0x5d1f8eF6EAaD51191964c3b3bE3112Dc0F44BFEB");

    let amount = ethers.utils.parseEther("0.001");
    let wftm_address =  "0xf1277d1Ed8AD466beddF92ef448A132661956621";
    const owner = await ethers.getSigner();


    // First the owner gets some WFTM
    let iface_deposit = new ethers.utils.Interface(["function deposit()"]);
    let data_deposit = iface_deposit.encodeFunctionData("deposit", []);

    await(await owner.sendTransaction({to: wftm_address, data : data_deposit, value:amount})).wait(3);

    // Owner approves the UniswapV2SingleSwap contract to spend his tokens
    let iface = new ethers.utils.Interface(["function approve(address guy, uint256 wad)"]);
    let data = iface.encodeFunctionData("approve", [uniswap_singleswap_deployed.address, amount]);   
    
    await(await owner.sendTransaction({to: wftm_address, data : data})).wait(2);

    await uniswap_singleswap_deployed.swapSingleExactAmountIn(amount, {gasLimit: 2500000});

  
}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});