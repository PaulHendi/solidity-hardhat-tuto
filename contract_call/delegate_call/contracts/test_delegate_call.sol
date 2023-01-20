// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract TestDelegateCall {
    // Storage layout must be the same as contract A
    uint public num;
    address public sender;
    uint public value;

    function setVars(uint _num) external payable {
        num = _num;
        sender = msg.sender;
        value = msg.value;
    }

    function setNum(uint _num) external {
        num = _num;
    }
}
