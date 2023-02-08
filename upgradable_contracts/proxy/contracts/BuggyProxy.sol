
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


contract BuggyProxy {
    address public implementation;
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    function _delegate() private returns (bytes memory) {
        (bool ok, bytes memory res) = implementation.delegatecall(msg.data);
        require(ok, "delegatecall failed");
        return res;
    }

    fallback() external payable {
        _delegate();
    }

    receive() external payable {
        _delegate();
    }

    function upgradeTo(address _implementation) external {
        require(msg.sender == admin, "not authorized");
        implementation = _implementation;
    }
}
