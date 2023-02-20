// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import and use hardhat/console.sol to debug your contract
// import "hardhat/console.sol";

import "./IERC20.sol";
import "./IUniswapV2Router01.sol";

contract UniswapV2SingleSwap {

    // Fantom testnet Spookyswap router
    address private constant UNISWAP_V2_ROUTER = 0xa6AD18C2aC47803E193F75c3677b14BF19B94883;

    // WFTM and Link addresses on Fantom testnet
    address private constant WFTM = 0xf1277d1Ed8AD466beddF92ef448A132661956621;
    address private constant LINK = 0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F;

    IUniswapV2Router01 private constant router = IUniswapV2Router01(UNISWAP_V2_ROUTER);
    IERC20 private constant wftm = IERC20(WFTM);
    IERC20 private constant link = IERC20(LINK);

    function swapSingleExactAmountIn(uint amountIn)
        external
    {
        wftm.transferFrom(msg.sender, address(this), amountIn);
        wftm.approve(address(router), amountIn);
        
        address[] memory path = new address[](2);
        path[0] = WFTM;
        path[1] = LINK;
        
        router.swapExactTokensForTokens(amountIn, 
                                 0,
                                 path,
                                 address(this),
                                 block.timestamp);
    }

    function swapSingleExactFTMIn()
        external
        payable
    {
        
        address[] memory path = new address[](2);
        path[0] = WFTM;
        path[1] = LINK;
        
        router.swapExactETHForTokens{value: msg.value}(0, 
                                                       path, 
                                                       address(this), 
                                                       block.timestamp);
    }

    function swapSingleExactAmountOut(
        uint amountOutDesired,
        uint amountInMax
    ) external {
        wftm.transferFrom(msg.sender, address(this), amountInMax);
        wftm.approve(address(router), amountInMax);
        
        address[] memory path = new address[](2);
        path[0] = WFTM;
        path[1] = LINK;
        
        uint[] memory amounts = router.swapTokensForExactTokens(
            amountOutDesired,
            amountInMax,
            path,
            msg.sender,
            block.timestamp);
    
        if (amounts[0]< amountInMax) {
            wftm.transfer( msg.sender, amountInMax - amounts[0]);    
        }
        
    }
}

