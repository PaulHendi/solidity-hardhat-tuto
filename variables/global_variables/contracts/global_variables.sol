// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract GlobalVariables {

    function returnSender() external view returns (address) {
        return msg.sender;
    }

    function returnTimestamp() external view returns (uint) {
        return block.timestamp;
    }

    function returnBlockNum() external view returns (uint) {
        return block.number;
    }

    function returnBlockHash() external view returns (bytes32) {
        return blockhash(block.number);
    }            
}
