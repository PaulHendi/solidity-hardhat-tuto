// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract EthLendingPool {
    mapping(address => uint) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint _amount) external {
        balances[msg.sender] -= _amount;
        (bool sent, ) = msg.sender.call{value: _amount}("");
        require(sent, "send ETH failed");
    }

    receive() external payable {} // Added this function to provide ETH for tests

    function flashLoan(
        uint _amount,
        address _target,
        bytes calldata _data
    ) external {
        uint balBefore = address(this).balance;
        require(balBefore >= _amount, "borrow amount > balance");

        (bool executed, ) = _target.call{value: _amount}(_data);
        require(executed, "loan failed");

        uint balAfter = address(this).balance;
        require(balAfter >= balBefore, "balance after < before");
    }
}
