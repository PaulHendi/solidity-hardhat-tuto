Constant sum AMM (automated market maker) is a decentralized exchange that trades two tokens in the contract.

Users will be able to add liquidity and earn swap fees, swap tokens and remove liquidity.

Why is it called constant sum?
The amount of token to come out of the trade is determined by the following equation.

X = amount of token A in the contract
Y = amount of token B in the contract
K = a constant that satisfies the following equation

X + Y = K

X + Y equals some constant K, hence the name constant sum.

This equation X + Y = K must be true before and after every swap.

dx = Amount of token A that came in from the swap
dy = Amount of token B that went out from the swap

# Before the trade
X + Y = K

# After the trade
X + dx + Y - dy = K

Since X + Y = K, replace K in the second equation X + dx + Y - dy = K with X + Y

X + dx + Y - dy = X + Y

Cancel out X and Y on both side of the equation

dx - dy = 0

or simply

dx = dy

In other words, the amount of token coming in from a swap must equal the amount of token going out.
