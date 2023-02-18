// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IERC721 {
    function transferFrom(address _from, address _to, uint _nftId) external;
}

contract DutchAuction {
    uint private constant DURATION = 7 days;

    IERC721 public immutable nft;
    uint public immutable nftId;

    address payable public immutable seller;
    uint public immutable startingPrice;
    uint public immutable startAt;
    uint public immutable expiresAt;
    uint public immutable discountRate;

    constructor(
        uint _startingPrice,
        uint _discountRate,
        address _nft,
        uint _nftId
    ) {
        seller = payable(msg.sender);
        startingPrice = _startingPrice;
        startAt = block.timestamp;
        expiresAt = block.timestamp + DURATION;
        discountRate = _discountRate;

        require(
            _startingPrice >= _discountRate * DURATION,
            "starting price < min"
        );

        nft = IERC721(_nft);
        nftId = _nftId;
    }

    function getPrice() public view returns (uint) {
        // Code here
        return (startingPrice - discountRate* (block.timestamp-startAt));
    }

    function buy() external payable {
        // Code here
        require(expiresAt>block.timestamp, "Expired");
        uint current_price = getPrice();
        require(msg.value>=current_price, "Amount too low");
        
        nft.transferFrom(seller, msg.sender, nftId);
        payable(msg.sender).transfer(msg.value-current_price);
        selfdestruct(seller);
        
    }
}

