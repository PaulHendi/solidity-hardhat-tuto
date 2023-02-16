# Solidity API

## StakingRewards

### stakingToken

```solidity
contract IERC1155 stakingToken
```

### owner

```solidity
address owner
```

### userRewardPaid

```solidity
mapping(address => uint256) userRewardPaid
```

### totalStaked

```solidity
uint256 totalStaked
```

### Userdata

```solidity
struct Userdata {
  uint256 balanceOf;
  uint256[] stakedAt;
  uint256[] redeemedAt;
}
```

### users

```solidity
address[] users
```

### staking

```solidity
mapping(address => bool) staking
```

### userdata

```solidity
mapping(address => struct StakingRewards.Userdata) userdata
```

### constructor

```solidity
constructor(address _stakingNFT) public
```

### onlyOwner

```solidity
modifier onlyOwner()
```

### _getDurationForUser

```solidity
function _getDurationForUser(address account) public view returns (uint256)
```

Calculates the duration of staked and redeemed tokens for 
a specific user

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | - address of particular user |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | userTotalTimeStaked - total duration of user's staking and redeem period |

### _getTotalDuration

```solidity
function _getTotalDuration() public view returns (uint256)
```

Calculates total duration from all users staking period

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | totalDuration - total sum of individual users stake duration |

### _getRewardsShare

```solidity
function _getRewardsShare(address account) public view returns (uint256)
```

Calculates rewards share for particular user based on duration as well
as amount of tokens staked

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | - Address of particular user |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | share - total rewards share |

### stake

```solidity
function stake(uint256 _amount) external
```

Main external function for user to stake tokens
- user must approve the contract to transfer tokens before calling this function

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _amount | uint256 | - amount of tokens to stake |

### withdraw

```solidity
function withdraw(uint256 _amount) external
```

This function allows a user to withdraw a certain amount of tokens staked in the contract.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _amount | uint256 | - amount of tokens to withdraw |

### getRewards

```solidity
function getRewards(address account) public view returns (uint256)
```

Allows user to claim rewards
- The rewards depends on current contract's balance, sometimes it worth waiting for a while
to claim rewards :)

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | - address of particular user |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | rewards - total rewards for user |

### claimRewards

```solidity
function claimRewards() external
```

Allows user to claim rewards

### emergencyWithdraw

```solidity
function emergencyWithdraw() external
```

Allows owner to withdraw all funds from the contract
- This function is only for testing (not wasting faucet funds)

### remove

```solidity
function remove(address _user) public
```

Utility function to remove user from the users array

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _user | address | - address of particular user |

## SFT

Caveats:
    invoke setPaused(true) if the NFTs are available to mint

### cost

```solidity
uint256 cost
```

### maxSupply

```solidity
uint256 maxSupply
```

### maxMintAmountPerTx

```solidity
uint256 maxMintAmountPerTx
```

### paused

```solidity
bool paused
```

### ID

```solidity
uint256 ID
```

### constructor

```solidity
constructor(string uri) public
```

### mintCompliance

```solidity
modifier mintCompliance(uint256 _mintAmount)
```

### totalSupply

```solidity
function totalSupply() public view returns (uint256)
```

### mint

```solidity
function mint(uint256 _mintAmount) public payable
```

### mintForAddress

```solidity
function mintForAddress(uint256 _mintAmount, address _receiver) public
```

### setCost

```solidity
function setCost(uint256 _cost) public
```

### setMaxMintAmountPerTx

```solidity
function setMaxMintAmountPerTx(uint256 _maxMintAmountPerTx) public
```

### setPaused

```solidity
function setPaused(bool _state) public
```

### withdraw

```solidity
function withdraw() public
```

