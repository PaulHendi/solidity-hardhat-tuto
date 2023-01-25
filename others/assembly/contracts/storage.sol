// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


contract Storage {

    uint256 private _val;

    event NewVal(uint256 val);

    function store(uint val) public {
        _val = val;
        emit NewVal(val);
    }

    function retrieve() public view returns (uint256) {
        return _val;
    }

}