// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./IERC20_permit.sol";

contract ERC20Bank {
    IERC20Permit public immutable token;
    mapping(address => uint) public balanceOf;

    constructor(address _token) {
        token = IERC20Permit(_token);
    }

    function depositWithPermit(
        address owner,
        address spender,
        uint amount,
        uint deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        token.permit(owner, spender, amount, deadline, v, r, s);
        token.transferFrom(owner, address(this), amount);
        balanceOf[spender] += amount;
    }

    function deposit(uint _amount) external {
        token.transferFrom(msg.sender, address(this), _amount);
        balanceOf[msg.sender] += _amount;
    }

    function withdraw(uint _amount) external {
        balanceOf[msg.sender] -= _amount;
        token.transfer(msg.sender, _amount);
    }
}