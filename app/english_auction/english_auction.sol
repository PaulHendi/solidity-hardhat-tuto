// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IERC721 {
    function transferFrom(address from, address to, uint nftId) external;
}

contract EnglishAuction {
    event Start();
    event Bid(address indexed sender, uint amount);
    event Withdraw(address indexed bidder, uint amount);
    event End(address winner, uint amount);

    IERC721 public immutable nft;
    uint public immutable nftId;

    address payable public immutable seller;
    uint public endAt;
    bool public started;
    bool public ended;

    address public highestBidder;
    uint public highestBid;
    // mapping from bidder to amount of ETH the bidder can withdraw
    mapping(address => uint) public bids;

    constructor(address _nft, uint _nftId, uint _startingBid) {
        nft = IERC721(_nft);
        nftId = _nftId;

        seller = payable(msg.sender);
        highestBid = _startingBid;
    }

    modifier onlySeller{
        require(msg.sender==seller, "Not the seller");
        _;
    }


    function start() external onlySeller{
        // Write your code here
        require(!started, "Auction already started");
        
        nft.transferFrom(seller, address(this), nftId);
        
        started = true;
        endAt = block.timestamp + 7 days;
        
        emit Start();
        
    }

    function bid() external payable {
        // Write your code here
        require(started, "Not started yet");
        require(block.timestamp < endAt, "Ended already");
        
        require(msg.value>highestBid, "Need higher bid");
        if (highestBidder != address(0)) {
            bids[highestBidder] += highestBid;
        }
        highestBidder = msg.sender;
        highestBid = msg.value;
        
        emit Bid(msg.sender, msg.value);
    }

    function withdraw() external {
        // Write your code here
        uint amount = bids[msg.sender];
        require(amount>0, "Amount is 0");
        
        bids[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        
        emit Withdraw(msg.sender, amount);
        
    }

    function end() external {
        // Write your code here
        require(started, "Not started yet");
        require(endAt< block.timestamp, "Didn't expire yet");
        
        require(!ended, "Auction already");
        ended = true;
        
        if (highestBidder != address(0)) {
        nft.transferFrom(address(this), highestBidder, nftId);
        seller.transfer(highestBid);
        } else {
            nft.transferFrom(address(this), seller, nftId);
        }
        emit End(highestBidder, highestBid);
        
    }
}

