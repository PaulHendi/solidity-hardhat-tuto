// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract StakingRewards is ERC1155Holder {
    IERC1155 public immutable stakingToken;

    address public owner;


    // Minimum of last updated time and reward finish time
    uint public updatedAt;
    // Reward to be paid out per second
    uint public rewardRate;
    // Sum of (reward rate * dt * 1e18 / total supply)
    uint public rewardPerTokenStored;
    // User address => rewardPerTokenStored
    mapping(address => uint) public userRewardPerTokenPaid;
    // User address => rewards to be claimed
    mapping(address => uint) public rewards;

    // Total staked
    uint public totalSupply;

    struct Userdata {
        uint256 balanceOf;
        uint256[] stakedAt;
        uint256[] redeemedAt;
        uint256 rewards;
    }

    address[] public users;
    mapping(address => bool) public staking;
    mapping(address => Userdata) public userdata;

    uint256 public NUMERATOR = 10000; 
    uint256 public DENOMINATOR = 1000000; 

    constructor(address _stakingNFT) {
        owner = msg.sender;
        stakingToken = IERC1155(_stakingNFT);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not authorized");
        _;
    }


    function _getDurationForUser(address account) public view returns (uint) {
        uint256 nft_staked = userdata[account].balanceOf;

        // Check if current user has retrieved his rewards

        uint256 userTotalTimeStaked = 0;
        for (uint i=0; i<nft_staked; i++) {
            if(userdata[account].redeemedAt[i] == 0) {
                userTotalTimeStaked += (block.timestamp - userdata[account].stakedAt[i]);
            } else {
                userTotalTimeStaked += (userdata[account].redeemedAt[i] - userdata[account].stakedAt[i]);
            }
        }
        
        return userTotalTimeStaked;
    }


    function _getTotalDuration() public view returns (uint) {
        uint256 totalDuration = 0;
        for (uint i=0; i<users.length; i++) {
            totalDuration += _getDurationForUser(users[i]);
        }
        return totalDuration;
    }


    function _getRewardsShare(address account) public view returns (uint) {
        uint256 userDurationWeight = _getDurationForUser(account) / _getTotalDuration();
        uint256 userAmountWeight = userdata[account].balanceOf / totalSupply;

        return (userDurationWeight + userAmountWeight)/2;
    }



    function stake(uint _amount) external  {
        require(_amount > 0, "amount = 0");
        
        stakingToken.safeTransferFrom(msg.sender, address(this), 0, _amount, "");
        totalSupply += _amount;

        userdata[msg.sender].balanceOf += _amount;
        users.push(msg.sender);
        staking[msg.sender] = true;
        
        for (uint i=0; i<=_amount; i++) {
            userdata[msg.sender].stakedAt.push(block.timestamp);
            userdata[msg.sender].redeemedAt.push(0);
        }
    }

    function withdraw(uint _amount) external  {
        require(_amount > 0, "amount = 0"); 
        require(userdata[msg.sender].balanceOf >= _amount, "not enough balance");

        totalSupply -= _amount;
        userdata[msg.sender].balanceOf -= _amount;
        if (userdata[msg.sender].balanceOf == 0) {
            staking[msg.sender] = false;
        }
        for (uint i=0; i<=_amount; i++) {
            userdata[msg.sender].redeemedAt[i] = block.timestamp;
        }        
        stakingToken.safeTransferFrom(address(this), msg.sender, 0, _amount, "");
    }

    function getRewards(address account) public view returns (uint256) {
        return _getRewardsShare(account)*totalSupply;
    }


}