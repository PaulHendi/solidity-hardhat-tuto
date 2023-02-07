const {ethers} = require("hardhat");


async function main() {

    spookyswap_router = "0xa6AD18C2aC47803E193F75c3677b14BF19B94883";

    let amount = ethers.utils.parseEther("0.1");
    //let wftm_address =  "0x812666209b90344Ec8e528375298ab9045c2Bd08";
    let wftm_address = "0xf1277d1Ed8AD466beddF92ef448A132661956621";
    let link_address = "0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F";

    const owner = await ethers.getSigner();


    // First the owner gets some WFTM
    let iface_deposit = new ethers.utils.Interface(["function deposit()"]);
    let data_deposit = iface_deposit.encodeFunctionData("deposit", []);

    await(await owner.sendTransaction({to: wftm_address, data : data_deposit, value:amount})).wait(3);


    // Owner approves the UniswapV2SingleSwap contract to spend his tokens

    // from WFTM contract
    let iface = new ethers.utils.Interface(["function approve(address guy, uint256 wad)"]);
    let data = iface.encodeFunctionData("approve", [spookyswap_router, amount]);   
    
    await(await owner.sendTransaction({to: wftm_address, data : data})).wait(3);

    // Swap Exact Tokens For Tokens
    let iface2 = new ethers.utils.Interface(["function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)"]);
    let data2 =  iface2.encodeFunctionData("swapExactTokensForTokens", 
                                            [amount,
                                            "0",
                                            [wftm_address, link_address],
                                            owner.address,
                                            Math.floor(Date.now() / 1000) + 60 * 60]);

    await(await owner.sendTransaction({to: spookyswap_router, data : data2, gasLimit:2500000})).wait(3);


    // Now we have a problem, the liquidity pool is almost empty
    // We need to add liquidity to the pool (0x1060b870859c981b05C4CC7baE91d884f7dF9590)

}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});

