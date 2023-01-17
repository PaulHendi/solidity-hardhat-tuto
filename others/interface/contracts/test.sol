// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


contract Test {

    uint private num;

    function count() external view returns (uint) {
        return num;
    }

    function inc() external {
        num+=1;
    }

    function dec() external {
        num-=1;
    }

}
