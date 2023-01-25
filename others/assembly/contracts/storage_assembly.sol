// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract StorageAssembly{

    uint256 private _val;
    event NewVal(uint256 val);


    function store(uint256 val) public {

        assembly{
            // Store val at slot 0 of storage
            sstore(0, val)

            // emit event
            // Used Remix to get the hash of the event
            // bytes32(keccak256("NewVal(uint256)") = 0x8d556f7fd25e040bfe6111f5ae22037d01373103d9c1c3d505b7e3ce83460b09
            mstore(0x80, val) // Available ram memory starts at 0x80
            log1(0x80, 0x20, 0x8d556f7fd25e040bfe6111f5ae22037d01373103d9c1c3d505b7e3ce83460b09)
        }

    }

    function retrieve() public view returns (uint256) {

        assembly{

            // Load value at slot 0 of storage (sload(0) = val)
            let v := sload(0)

            // store into memory at 0x80
            mstore(0x80, v)

            // return the stored v of size 32 bytes
            return(0x80, 32)

        }

    }

}