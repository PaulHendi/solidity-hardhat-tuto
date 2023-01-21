// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MultiCall {
    function multiCall(
        address[] calldata targets,
        bytes[] calldata data
    ) external view returns (bytes[] memory) {
        bytes[] memory results = new bytes[](data.length);

        require(targets.length==data.length, "Target and data lengths not equal");

        for (uint i=0; i<targets.length; i++) {
            
            (bool success, bytes memory response) = targets[i].staticcall(data[i]);
            require(success, "call failed");
            results[i] = response;
        }

        return results;
    }
}

