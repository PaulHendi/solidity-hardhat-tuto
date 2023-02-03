//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface randomness_interface {
    function randomNumber(uint) external view returns (uint);
    function getRandom(uint) external;
}