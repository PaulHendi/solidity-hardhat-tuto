// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract EtherWallet {
    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }
    
    modifier onlyOwner{
        require(msg.sender==owner, "Not owner");
        _;
    }
    
    receive() external payable {}
    fallback() external payable {}
    
    function withdraw(uint _amount) external onlyOwner {
        (bool sent, ) = owner.call{value:_amount}("");
        require(sent, "Failed to send Ether");
    }
}