// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract PiggyBank {
    event Deposit(uint amount);
    event Withdraw(uint amount);
    address public owner;
    uint public balance;
    
    modifier onlyOwner {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor () {
        owner = msg.sender;
    }
    
    receive() external payable {
        balance+=msg.value;
        emit Deposit(msg.value);
    }
    
    function withdraw() external onlyOwner{
        uint balance_sc = address(this).balance;
        emit Withdraw(balance_sc);
        
        selfdestruct(payable(owner));
    }
    
}

