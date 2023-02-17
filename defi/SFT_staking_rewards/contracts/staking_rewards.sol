// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract StakingRewards is ERC1155Holder {
    IERC1155 public immutable stakingToken;

    address public owner;

    event FTMReceived(address indexed sender, uint256 amount);
    event NFTStaked(address indexed sender, uint256 amount);
    event NFTUnstaked(address indexed sender, uint256 amount);
    event RewardsClaimed(address indexed sender, uint256 amount);

    // User address => rewardPerTokenStored
    mapping(address => uint) public userRewardPaid; // Variable to store rewards which users claimed

    // Total staked
    uint public totalStaked; // Variable to store total amount of tokens staked by all users

    struct Userdata {
        uint256 balanceOf; // Balance of user
        uint256[] stakedAt; // Allows the function to track the time when each token was staked and redeemed
        uint256[] redeemedAt; 
        uint256 previousBalance; // Allows the function to track if user was staking before
    }

    address[] public users; // Stores addresses of all users
    mapping(address => Userdata) public userdata; // Mapping which stores data for every user

    uint256 public SCALE = 1_000_000;

    constructor(address _stakingNFT) {
        owner = msg.sender;
        stakingToken = IERC1155(_stakingNFT);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not authorized");
        _;
    }

    /**
     * Calculates the duration of staked and redeemed tokens for 
     * a specific user
     * @param account - address of particular user
     * @return userTotalTimeStaked - total duration of user's staking and redeem period
     */
    function _getDurationForUser(address account) public view returns (uint) {
        uint256 nft_staked = userdata[account].balanceOf;

        uint256 userTotalTimeStaked = 0;
        // Loops through all users tokens
        for (uint i=0; i<nft_staked; i++) {
            // If token is still staked
            if(userdata[account].redeemedAt[i] == 0) {
                // Calculates the time since token was staked
                userTotalTimeStaked += (block.timestamp - userdata[account].stakedAt[i]);
            } else {
                // Calculates the total duration token was staked
                userTotalTimeStaked += (userdata[account].redeemedAt[i] - userdata[account].stakedAt[i]);
            }
        }
        
        return userTotalTimeStaked;
    }

    /**
     * Calculates total duration from all users staking period
     * @return totalDuration - total sum of individual users stake duration 
     */
    function _getTotalDuration() public view returns (uint) {
        uint256 totalDuration = 0;
        // Loops through all users
        for (uint i=0; i<users.length; i++) {
            totalDuration += _getDurationForUser(users[i]);
        }
        return totalDuration;
    }

    /**
     * Calculates rewards share for particular user based on duration as well
     * as amount of tokens staked  
     * @param account - Address of particular user
     * @return share - total rewards share
     */
    function _getRewardsShare(address account) public view returns (uint) {
        uint256 _userDurationWeight = _getDurationForUser(account) * SCALE / _getTotalDuration();
        uint256 _userAmountWeight = userdata[account].balanceOf * SCALE / totalStaked;

        return (_userDurationWeight + _userAmountWeight)/2;
    }

    /**
     * Main external function for user to stake tokens
     * @notice - user must approve the contract to transfer tokens before calling this function
     * @param _amount - amount of tokens to stake
     */
    function stake(uint _amount) external  {
        require(_amount > 0, "amount = 0");
        
        // Transfers token from user to the contract
        stakingToken.safeTransferFrom(msg.sender, address(this), 0, _amount, "");

        // Updates total staked amount
        totalStaked += _amount;

        // Updates user's balance
        userdata[msg.sender].balanceOf += _amount;

        // Checks if user already exists in the mapping
        int256 index_user = indexOf(msg.sender); 
        if ( index_user == -1) {
            // If user doesn't exist, adds user to the mapping
            users.push(msg.sender);       
        }

        // Updates user's staking time
        for (uint i=0; i<=_amount; i++) {
            userdata[msg.sender].stakedAt.push(block.timestamp);
            userdata[msg.sender].redeemedAt.push(0);
        }

        emit NFTStaked(msg.sender, _amount);
    }

    /**
     * This function allows a user to withdraw a certain amount of tokens staked in the contract.
     * @param _amount - amount of tokens to withdraw
     */
    function unstake(uint _amount) external  {  
        require(_amount > 0, "amount = 0"); 
        require(userdata[msg.sender].balanceOf >= _amount, "not enough balance");

        // User is not staking anymore
        if ( (userdata[msg.sender].balanceOf - _amount) == 0) {
            claimRewards();

            // If user doesn't have any tokens staked, removes user from the mapping
            delete userdata[msg.sender];
            remove(msg.sender);
        }      
        else {
            // Updates user's staking time
            for (uint i=0; i<=_amount; i++) {
                userdata[msg.sender].redeemedAt[i] = block.timestamp;
            }    
            // Updates user's balance
            userdata[msg.sender].balanceOf -= _amount;
        }

        // Updates total staked amount
        totalStaked -= _amount;


        // Transfers token from contract to user
        stakingToken.safeTransferFrom(address(this), msg.sender, 0, _amount, "");

        emit NFTUnstaked(msg.sender, _amount);
    }

    /**
     * Allows user to claim rewards
     * @param account - address of particular user
     * @notice - The rewards depends on current contract's balance, sometimes it worth waiting for a while
     * to claim rewards :) 
     * @return rewards - total rewards for user
     */
    function getRewards(address account) public view returns (uint256) {
        return _getRewardsShare(account)*address(this).balance/SCALE;
    }

    /**
     * Allows user to claim rewards
     */
    function claimRewards() public {

        // Checks if user has any rewards to claim
        uint256 rewards = getRewards(msg.sender);
        require(rewards > 0, "no rewards");

        // Updates user's rewards
        userRewardPaid[msg.sender] += rewards;
        
        // If user still has tokens staked, updates user's staking time
        for (uint i=0; i<userdata[msg.sender].balanceOf; i++) {
            userdata[msg.sender].stakedAt[i] = block.timestamp;
            userdata[msg.sender].redeemedAt[i] = 0;
        }
        
        
        // Transfers rewards to user
        payable(msg.sender).transfer(rewards);

        emit RewardsClaimed(msg.sender, rewards);
    }

    /**
     * Allows owner to withdraw all funds from the contract
     * @notice - This function is only for testing (not wasting faucet funds)
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    /**
     * Utility function to check if user exists in the users array and returns index
     * @param _user - address of particular user
     * @return index - index of user in the users array (or -1 if user doesn't exist)
     */
    function indexOf(address _user) private view returns (int256) {
        for (uint256 i = 0; i < users.length; i++) {
          if (users[i] == _user) {
            return int(i);
          }
        }
        return -1; // not found
      }

    /**
     * Utility function to remove user from the users array
     * @param _user - address of particular user
    */
    function remove(address _user) public {
        require(users.length > 0, "Can't remove from empty array");

        // Finds index of user in the users array
        int index = indexOf(_user);
        require(index >= 0, "User not found");

        // Removes user from the users array
        users[uint(index)] = users[users.length - 1];
        users.pop();
    }


    fallback() external payable {
        // Fallback function
        emit FTMReceived(msg.sender, msg.value);
    }

    receive() external payable {
        // Receive function
        emit FTMReceived(msg.sender, msg.value);
    }
    

}