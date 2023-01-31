// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./IERC20.sol";

contract ERC20 is IERC20 {
    uint public totalSupply = 1000;
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;
    string public name;
    string public symbol;
    uint8 public decimals; // Not used in this contract for simplicity

    constructor(string memory _name, string memory _symbol, uint8 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address recipient, uint amount) external returns (bool) {
        
        require(balanceOf[msg.sender]>= amount);
        
        balanceOf[recipient] += amount;
        balanceOf[msg.sender] -= amount;
        
        emit Transfer(msg.sender, recipient, amount);
        
        return true;
    }

    function approve(address spender, uint amount) external returns (bool) {
        allowance[msg.sender][spender] += amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool) {
        
        allowance[sender][msg.sender] -= amount;
        
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        
        emit Transfer(sender, recipient, amount);
        
        return true;
    }

    function mint(address sender, uint amount) public {
        // code
        balanceOf[sender] += amount;
        totalSupply+=amount;
        
        emit Transfer(address(0), sender, amount);
    }

    function burn(address sender,uint amount) public {
        // code
        balanceOf[sender] -= amount;
        totalSupply-=amount;
        
        emit Transfer(sender, address(0), amount);        
    }
}

