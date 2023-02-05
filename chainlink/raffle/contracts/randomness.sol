// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../node_modules/@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "./lottery.sol";

contract RandomNumberConsumer is VRFConsumerBase {
    
    Lottery public lottery_contract;

    bytes32 internal keyHash;
    uint256 internal fee;
    mapping (uint => uint) public randomNumber;
    mapping (bytes32 => uint) public requestIds;
    uint256 public most_recent_random;

    uint256 public counter = 0;
    address public owner;

    modifier onlyOnce() {
        require(counter == 0, "Can only be called once");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }
    
    /**
     * Constructor inherits VRFConsumerBase
     * 
     * Network: Fantom testnet
     * Chainlink VRF Coordinator address: 0xbd13f08b8352A3635218ab9418E340c60d6Eb418   
     * LINK token address:                0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F
     * Key Hash: 0x121a143066e0f2f08b620784af77cccb35c6242460b4a8ee251b4b416abaebd4
     */

     // Found the bug : The chainLink VRF corresponds to VRF V2
     // But we are using V1 functions (as in the tutorial actually)
     // So we need to update the code to inherit VRF V2 and use requestRandomWords instead of requestRandomness

    constructor() 
        VRFConsumerBase(
            0xbd13f08b8352A3635218ab9418E340c60d6Eb418, // VRF Coordinator
            0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F  // LINK Token
        ) 
    {
        keyHash = 0x121a143066e0f2f08b620784af77cccb35c6242460b4a8ee251b4b416abaebd4;
        // 0.0005 LINK (500 millionth of a LINK, check fulfillmentFlatFeeLinkPPMTier1 in the VRF Coordinator contract)
        fee = 0.0005 * 10 ** 18; 

        owner = msg.sender;
    }


    function set_lottery_contract(address lottery_address) public onlyOnce onlyOwner{
        lottery_contract = Lottery(lottery_address);
        counter = counter + 1;
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

