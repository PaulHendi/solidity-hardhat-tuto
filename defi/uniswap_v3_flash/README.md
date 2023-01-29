Borrow tokens from Uniswap V3 pool and the repay with fee in a single transaction. This is called flash loan.

Call flash on Uniswap V3 pool to borrow WETH.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IUniswapV3Pool {
    function flash(
        address recipient,
        uint amount0,
        uint amount1,
        bytes calldata data
    ) external;
}
