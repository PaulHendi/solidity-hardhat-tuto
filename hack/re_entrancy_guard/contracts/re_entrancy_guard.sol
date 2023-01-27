// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract ReentrancyGuard {
    // Count stores number of times the function test was called
    uint public count;
    
    bool locked = false;
    
    modifier guard {
        require(!locked, "Locked");
        locked = true;
        _;
        locked = false;
    }

    function test(address _contract) external guard {
        (bool success, ) = _contract.call("");
        require(success, "tx failed");
        count += 1;
    }
}

