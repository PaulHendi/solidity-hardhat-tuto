// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./randomness.sol";

contract CoinFlip {

    RandomNumberConsumer public randomness_contract;


    event GameResult(address player, uint256 random_number, uint256 bet);

    uint256[] public amounts = [0.1 ether, 0.5 ether, 1 ether];

    // 5 percent is taken from every winning bet
    uint256 public winning_fee = 5; 
    uint256 public denominator = 100;

    enum Bet {HEADS, TAILS}

    struct Game {
        address player;
        uint256 bet;
        uint256 amount;
        bool ended;
    }

    mapping(uint256 => Game) public games;

    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }



    constructor(address randomness_address) {
        randomness_contract = RandomNumberConsumer(randomness_address);
        owner = msg.sender;
    }


    fallback() external payable {}

    receive() external payable {}


    function play(uint256 _bet) public payable {

        require(_bet == uint256(Bet.HEADS) || _bet == uint256(Bet.TAILS), 
                "You must guess either heads or tails");

        require(msg.value == amounts[0] || msg.value == amounts[1] || msg.value == amounts[2], 
                "Amount sent not correct");

                                             
        uint256 requestId = randomness_contract.getRandom();
        games[requestId] = Game(msg.sender,
                                _bet, 
                                msg.value, 
                                false);          
    }

    function flip_result(uint256 requestId, uint256 random_number) public {

        require(msg.sender == address(randomness_contract), "Only the RandomNumberConsumer contract can call this function");
        require(games[requestId].ended == false, "Game already ended");
        require(games[requestId].player != address(0), "No game found with this id");
        require(address(this).balance >= games[requestId].amount, "Contract balance too low");

        uint256 side = random_number % 2;


        if (side == games[requestId].bet) {
            uint256 amount_won = games[requestId].amount * 2 - games[requestId].amount * winning_fee / denominator;
            payable(games[requestId].player).transfer(amount_won);
        }

        emit GameResult(games[requestId].player, side, games[requestId].bet);
    }

}