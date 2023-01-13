call is a low level function to call other contracts.

Here is the contract that is called

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract TestCall {
    fallback() external payable {}

    function foo(
        string memory _message,
        uint _x
    ) external payable returns (bool) {
        return true;
    }

    bool public barWasCalled;

    function bar(uint _x, bool _b) external {
        barWasCalled = true;
    }
}
