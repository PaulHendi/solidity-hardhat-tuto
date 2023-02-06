// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../node_modules/@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";

contract randomness is VRFV2WrapperConsumerBase {

    struct RequestStatus {
        uint256 paid; // amount paid in link
        bool fulfilled; // whether the request has been successfully fulfilled
        uint256 randomWords;
    }
    RequestStatus public request; /* requestId --> requestStatus */

    uint32 callbackGasLimit = 1000000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    // For this example, retrieve 2 random values in one request.
    // Cannot exceed VRFV2Wrapper.getConfig().maxNumWords.
    uint32 numWords = 1;    

    // Address LINK - hardcoded for Fantom testnet
    address linkAddress = 0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F;

    // address WRAPPER - hardcoded for Fantom testnet
    address wrapperAddress = 0x38336BDaE79747a1d2c4e6C67BBF382244287ca6;

    address owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    constructor() VRFV2WrapperConsumerBase(linkAddress, wrapperAddress){

        owner = msg.sender;
    }


    function requestRandomWords() external onlyOwner returns (uint256 requestId){
        requestId = requestRandomness(callbackGasLimit, requestConfirmations, numWords);
        request = RequestStatus({
                                paid: VRF_V2_WRAPPER.calculateRequestPrice(callbackGasLimit),
                                randomWords: 0,
                                fulfilled: false});

        
        return requestId;
    }


    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(request.paid > 0, "request not found");
        request.fulfilled = true;
        request.randomWords = _randomWords[0];
    }

    function getRandomNumber() external view returns (uint256) {
        return (request.randomWords%10);
    }



}