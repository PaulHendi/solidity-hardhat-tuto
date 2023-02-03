//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface governance_interface {
    function lottery() external view returns (address);
    function randomness() external view returns (address);
}