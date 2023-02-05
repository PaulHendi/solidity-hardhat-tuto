// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./randomness.sol";

contract Lottery  {

    enum LOTTERY_STATE { OPEN, CLOSED, CALCULATING_WINNER }
    address public owner;

    RandomNumberConsumer public randomness_contract;

    struct lottery {
        LOTTERY_STATE lottery_state;
        uint256 minimum;
        address payable[] players;
    }

    mapping(uint256 => lottery) public lotteries;
    uint256 public lotteryId;


    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    
    constructor(address randomness_address) {
        owner = msg.sender;
        randomness_contract = RandomNumberConsumer(randomness_address);
        lotteryId = 0;
        lotteries[lotteryId].lottery_state = LOTTERY_STATE.CLOSED;
    }

    
    function start_new_lottery() public onlyOwner{
        require(lotteries[lotteryId].lottery_state == LOTTERY_STATE.CLOSED, "can't start a new lottery yet");
        //lotteries[lotteryId].minimum = 0.1 ether;
        lotteries[lotteryId].lottery_state = LOTTERY_STATE.OPEN;
    }

    function enter() public payable {
        require(msg.value >= lotteries[lotteryId].minimum, "Not enough FTM sent");

        assert(lotteries[lotteryId].lottery_state == LOTTERY_STATE.OPEN);
        lotteries[lotteryId].players.push(payable(msg.sender));
    }     
  
    function end_lottery() public onlyOwner{

        require(lotteries[lotteryId].lottery_state == LOTTERY_STATE.OPEN, "The lottery hasn't even started!");

        lotteries[lotteryId].lottery_state = LOTTERY_STATE.CALCULATING_WINNER;
        lotteryId = lotteryId + 1;  
        pickWinner();
    }


    function pickWinner() private {

        require(lotteries[lotteryId-1].lottery_state == LOTTERY_STATE.CALCULATING_WINNER, "You aren't at that stage yet!");
        
        //this kicks off the request and returns through fulfill_random
        randomness_contract.getRandom(lotteryId-1);
        
    }
    
    function fulfill_random(uint256 randomness) external {

        require(lotteries[lotteryId-1].lottery_state == LOTTERY_STATE.CALCULATING_WINNER, "You aren't at that stage yet!");
        require(randomness > 0, "random-not-found");
        require(msg.sender == address(randomness_contract), "Call not coming from randomness contract");

        uint256 index = randomness % lotteries[lotteryId-1].players.length;
        lotteries[lotteryId-1].players[index].transfer(address(this).balance);
        lotteries[lotteryId-1].lottery_state = LOTTERY_STATE.CLOSED;
    }

    function get_players() public view returns (address payable[] memory) {
        return lotteries[lotteryId].players;
    }
    
    function get_pot() public view returns(uint256){
        return address(this).balance;
    }
}