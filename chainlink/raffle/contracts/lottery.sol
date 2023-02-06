// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./randomness.sol";

contract Lottery  {

    event LotteryStarted(uint256 lotteryId, uint256 ticket_price);
    event LotteryEntered(uint256 lotteryId, address player);
    event LotteryEnded(uint256 lotteryId);
    event LotteryWinner(uint256 lotteryId, address winner);

    enum LOTTERY_STATE { OPEN, CLOSED, CALCULATING_WINNER }
    address public owner;

    RandomNumberConsumer public randomness_contract;

    struct lottery {
        LOTTERY_STATE lottery_state;
        uint256 ticket_price;
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

    
    function start_new_lottery(uint256 _ticket_price) public onlyOwner{
        require(lotteries[lotteryId].lottery_state == LOTTERY_STATE.CLOSED, "can't start a new lottery yet");

        lotteries[lotteryId].ticket_price = _ticket_price;
        lotteries[lotteryId].lottery_state = LOTTERY_STATE.OPEN;

        emit LotteryStarted(lotteryId, _ticket_price);
    }

    function enter() public payable {
        require(msg.value == lotteries[lotteryId].ticket_price, "Wrong price, check the ticket price");
        require(lotteries[lotteryId].lottery_state == LOTTERY_STATE.OPEN, "The lottery hasn't even started!");

        lotteries[lotteryId].players.push(payable(msg.sender));

        emit LotteryEntered(lotteryId, msg.sender);
    }     
  
    // TODO : Need a re entrancy guard ?
    function end_lottery() public onlyOwner {

        require(lotteries[lotteryId].lottery_state == LOTTERY_STATE.OPEN, "The lottery hasn't even started!");
        lotteries[lotteryId].lottery_state = LOTTERY_STATE.CALCULATING_WINNER;

        randomness_contract.getRandom();
        lotteryId = lotteryId + 1;  

        emit LotteryEnded(lotteryId-1);
    }



    function fulfill_random(uint256 randomness) external {

        uint256 curr_lottery_id = lotteryId - 1;

        require(lotteries[curr_lottery_id].lottery_state == LOTTERY_STATE.CALCULATING_WINNER, "You aren't at that stage yet!");
        require(randomness > 0, "random-not-found");
        require(msg.sender == address(randomness_contract), "Call not coming from randomness contract");

        uint256 index = randomness % lotteries[curr_lottery_id].players.length;
        lotteries[curr_lottery_id].players[index].transfer(address(this).balance);
        lotteries[curr_lottery_id].lottery_state = LOTTERY_STATE.CLOSED;

        emit LotteryWinner(curr_lottery_id, lotteries[curr_lottery_id].players[index]);
    }

    function get_players() public view returns (address payable[] memory) {
        return lotteries[lotteryId].players;
    }
    
    function get_pot() public view returns(uint256){
        return address(this).balance;
    }
}