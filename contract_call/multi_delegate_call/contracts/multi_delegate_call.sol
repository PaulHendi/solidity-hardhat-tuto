// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MultiDelegatecall {

    error DelegatecallFailed();
    
    
    function multiDelegatecall(
        bytes[] calldata data
    ) external payable returns (bytes[] memory results) {
        // code here
        
        results = new bytes[](data.length);
        
        for (uint i;i<data.length;i++) {
            (bool success, bytes memory res) = address(this).delegatecall(data[i]);
            if (success) {
                results[i] = res;
            }
            else {
                revert DelegatecallFailed();
            }
        }
    }
}



contract TestMultiDelegatecall is MultiDelegatecall {
    
    event Log(address caller, string func, uint i);

    function func1(uint x, uint y) external returns (uint){
        emit Log(msg.sender, "func1", x + y);
        return x + y;
    }

    function func2() external returns (uint) {
        emit Log(msg.sender, "func2", 2);
        return 2;
    }
}