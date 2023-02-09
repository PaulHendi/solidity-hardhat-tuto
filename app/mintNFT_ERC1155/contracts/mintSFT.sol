// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/**
  Caveats:
    invoke setPaused(true) if the NFTs are available to mint
 */
contract SFT is ERC1155, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private supply;

    uint256 public cost = 0.01 ether; // Deploying on Fantom Opera, so 0.01 FTM 
    uint256 public maxSupply = 2500;
    uint256 public maxMintAmountPerTx = 5;

    bool public paused = true;

    uint256 public constant ID = 0;

    constructor(string memory uri) ERC1155(uri) {}

    modifier mintCompliance(uint256 _mintAmount) {
        require(
            _mintAmount > 0 && _mintAmount <= maxMintAmountPerTx,
            "Invalid mint amount!"
        );
        require(
            supply.current() + _mintAmount <= maxSupply,
            "Max supply exceeded!"
        );
        _;
    }

    function totalSupply() public view returns (uint256) {
        return supply.current();
    }

    function mint(uint256 _mintAmount)
        public
        payable
        mintCompliance(_mintAmount)
    {
        require(!paused, "The contract is paused!");
        require(msg.value >= cost * _mintAmount, "Insufficient funds!");

        _mint(msg.sender, ID, _mintAmount, "");
    }

    function mintForAddress(uint256 _mintAmount, address _receiver)
        public
        mintCompliance(_mintAmount)
        onlyOwner
    {
        _mint(_receiver, ID, _mintAmount, "");
    }


    function setCost(uint256 _cost) public onlyOwner {
        cost = _cost;
    }

    function setMaxMintAmountPerTx(uint256 _maxMintAmountPerTx)
        public
        onlyOwner
    {
        maxMintAmountPerTx = _maxMintAmountPerTx;
    }


    function setPaused(bool _state) public onlyOwner {
        paused = _state;
    }

    function withdraw() public onlyOwner {
        // This will transfer the remaining contract balance to the owner.
        (bool os, ) = payable(owner()).call{value: address(this).balance}("");
        require(os);
    }


}