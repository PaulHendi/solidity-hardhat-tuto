// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Counter {
    // Write your code here
    uint public count = 0;
    
    function inc() external returns(uint) {
        count = count + 1;
    }
    
    function dec() external returns(uint) {
        count = count - 1;
    }
}
