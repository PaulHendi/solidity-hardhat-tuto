// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../node_modules/@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";
import "./lottery.sol";

contract RandomNumberConsumer is VRFV2WrapperConsumerBase {
    
    Lottery public lottery_contract;


    mapping(uint256 => uint256) public random_numbers; 

    uint256 public counter = 0;
    address public owner;

    // Works for now
    uint32 callbackGasLimit = 1000000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    // Cannot exceed VRFV2Wrapper.getConfig().maxNumWords.
    uint32 numWords = 1;    

    // Address LINK - hardcoded for Fantom testnet
    address linkAddress = 0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F;

    // address WRAPPER - hardcoded for Fantom testnet
    address wrapperAddress = 0x38336BDaE79747a1d2c4e6C67BBF382244287ca6;    

    modifier onlyOnce() {
        require(counter == 0, "Can only be called once");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }
    

     // Found the bug : The chainLink VRF corresponds to VRF V2
     // But we are using V1 functions (as in the tutorial actually)
     // So we need to update the code to inherit VRF V2 and use requestRandomWords instead of requestRandomness

    constructor() VRFV2WrapperConsumerBase(linkAddress, wrapperAddress) {
        owner = msg.sender;
    }


    function set_lottery_contract(address lottery_address) public onlyOnce onlyOwner{
        lottery_contract = Lottery(lottery_address);
        counter = counter + 1;
    }

    /** 
     * Requests randomness from a user-provided seed
     */
     
    function getRandom() external {
        // Need to check that only the lottery contract can call this function
        uint256 _requestId = requestRandomness(callbackGasLimit, requestConfirmations, numWords);
        random_numbers[_requestId] = 0;        
    }



    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomWords(uint256 requestId, uint256[] memory _randomWords) internal override {
        random_numbers[requestId] = _randomWords[0];
        lottery_contract.fulfill_random(_randomWords[0]);
    }


}

