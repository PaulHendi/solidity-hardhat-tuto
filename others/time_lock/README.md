TimeLock is a contract where transactions must be queued for some minimum time before it can be executed.

It's usually used in DAO to increase transparency. Call to critical functions are restricted to time lock.

This give users time to take action before the transaction is executed by the time lock.

For example, TimeLock can be used to increase users' trust that the DAO will not rug pull.

Here is the contract that will be used to test TimeLock

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract TestTimeLock {
    address public timeLock;
    bool public canExecute;
    bool public executed;

    constructor(address _timeLock) {
        timeLock = _timeLock;
    }

    fallback() external {}

    function func() external payable {
        require(msg.sender == timeLock, "not time lock");
        require(canExecute, "cannot execute this function");
        executed = true;
    }

    function setCanExecute(bool _canExecute) external {
        canExecute = _canExecute;
    }
}
