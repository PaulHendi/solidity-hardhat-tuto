// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// You know what functions you can call, so you define an interface to TestInterface.
interface ITestInterface {
    function count() external view returns (uint);

    function inc() external;
    // Write your code here
    function dec() external;
}

// Contract that uses TestInterface interface to call TestInterface contract
contract CallInterface {
    function inc(address _test) external{
        ITestInterface(_test).inc();
    }

    function dec(address _test) external{
        ITestInterface(_test).dec();       
    }

    function count(address _test) external view returns (uint) {
        return ITestInterface(_test).count();
    }


}

