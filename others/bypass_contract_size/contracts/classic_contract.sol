// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract ClassicContract {
    address public target;

    constructor(address _target) {
        target = _target;
    }

    function pwn() external returns (bool){
        // write your code here
        (bool success, ) = target.call("");

        return success;
    }
}