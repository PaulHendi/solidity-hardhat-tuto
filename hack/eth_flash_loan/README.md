# EthLendingPool is offering flash loans for free.

The contract has 10 ETH. The exploit is based on the fact that the require checks if the balance of is smart contract is okay after the flash loan. So the sender simply deposit the whole balance loaned to the SC. Hence the require is okay, but the balance of the sender actually equals the whole balance of the SC, he can then withdraw.

