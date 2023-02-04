// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {randomness_interface} from "./interfaces/randomness_interface.sol";

contract Lottery  {
    enum LOTTERY_STATE { OPEN, CLOSED, CALCULATING_WINNER }
    address public owner;

    randomness_interface public randomness_contract;

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

    
    constructor()
    {
        lotteryId = 0;
        lotteries[lotteryId].lottery_state = LOTTERY_STATE.CLOSED;
    }

    
    function start_new_lottery() public onlyOwner{
        require(lotteries[lotteryId].lottery_state == LOTTERY_STATE.CLOSED, "can't start a new lottery yet");
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
        require(lotteries[lotteryId].lottery_state == LOTTERY_STATE.CALCULATING_WINNER, "You aren't at that stage yet!");
        randomness_contract.getRandom(lotteryId);
        //this kicks off the request and returns through fulfill_random
    }
    
    function fulfill_random(uint256 randomness) external {
        require(lotteries[lotteryId].lottery_state == LOTTERY_STATE.CALCULATING_WINNER, "You aren't at that stage yet!");
        require(randomness > 0, "random-not-found");
        // assert(msg.sender == governance.randomness());
        uint256 index = randomness % lotteries[lotteryId].players.length;
        lotteries[lotteryId].players[index].transfer(address(this).balance);
        lotteries[lotteryId].lottery_state = LOTTERY_STATE.CLOSED;
    }

    function get_players() public view returns (address payable[] memory) {
        return lotteries[lotteryId].players;
    }
    
    function get_pot() public view returns(uint256){
        return address(this).balance;
    }
}