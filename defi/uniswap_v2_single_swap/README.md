This challenge introduces 2 functions to swap tokens on Uniswap V2

swapExactTokensForTokens - Sell all of input token.
swapTokensForExactTokens - Buy specific amount of output token.
Here is the interface for Uniswap V2 router.

interface IUniswapV2Router {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}
