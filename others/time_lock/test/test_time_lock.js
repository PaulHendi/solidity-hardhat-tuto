const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("TimeLock", function () {

    let timeLock, testTimeLock;
    let timeLock_deployed, testTimeLock_deployed;

    it("should deploy contracts", async function () {
        
        timeLock = await ethers.getContractFactory("TimeLock");
        testTimeLock = await ethers.getContractFactory("TestTimeLock");

        timeLock_deployed = await timeLock.deploy();
        testTimeLock_deployed = await testTimeLock.deploy(timeLock_deployed.address);
    
    
    })

    it("should test a DAO with timelock", async function () {
    })

});