// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../node_modules/@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import {lottery_interface} from "./interfaces/lottery_interface.sol";

contract RandomNumberConsumer is VRFConsumerBase {
    
    lottery_interface public lottery_contract;

    bytes32 internal keyHash;
    uint256 internal fee;
    mapping (uint => uint) public randomNumber;
    mapping (bytes32 => uint) public requestIds;
    uint256 public most_recent_random;
    
    /**
     * Constructor inherits VRFConsumerBase
     * 
     * Network: Fantom testnet
     * Chainlink VRF Coordinator address: 0xbd13f08b8352A3635218ab9418E340c60d6Eb418
     * LINK token address:                0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F
     * Key Hash: 0x121a143066e0f2f08b620784af77cccb35c6242460b4a8ee251b4b416abaebd4
     */
    constructor() 
        VRFConsumerBase(
            0xbd13f08b8352A3635218ab9418E340c60d6Eb418, // VRF Coordinator
            0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F  // LINK Token
        ) 
    {
        keyHash = 0x121a143066e0f2f08b620784af77cccb35c6242460b4a8ee251b4b416abaebd4;
        fee = 0.0005 * 10 ** 18; // 0.0005 LINK
    }

    /** 
     * Requests randomness from a user-provided seed
     */
     
    function getRandom(uint256 lotteryId) public {
        require(LINK.balanceOf(address(this)) > fee, "Not enough LINK - fill contract with faucet");
        bytes32 _requestId = requestRandomness(keyHash, fee);
        requestIds[_requestId] = lotteryId;
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        most_recent_random = randomness;
        uint lotteryId = requestIds[requestId];
        randomNumber[lotteryId] = randomness;
        lottery_contract.fulfill_random(randomness);
    }

}

