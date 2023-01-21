const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("Test multi call", () => {

    let contract_called, contract_that_calls;
    let contract_called1_deployed, contract_called2_deployed,contract_called3_deployed, contract_that_calls_deployed;


    it("should test multi call", async() => {


        contract_called = await ethers.getContractFactory("TestMultiCall");
        contract_that_calls = await ethers.getContractFactory("MultiCall");

        // Make three instances of the same contract
        contract_called1_deployed = await contract_called.deploy();
        contract_called2_deployed = await contract_called.deploy();
        contract_called3_deployed = await contract_called.deploy();

        contract_that_calls_deployed = await contract_that_calls.deploy();

        // All different contract addresses
        let addresses = [contract_called1_deployed.address,
                       contract_called2_deployed.address,
                       contract_called3_deployed.address]

        // Encoding data for the function test               
        let ABI = ["function test(uint _i)"]
        let iface = new ethers.utils.Interface(ABI);
        
        let data = [iface.encodeFunctionData("test",["1"]),
                    iface.encodeFunctionData("test",["2"]),
                    iface.encodeFunctionData("test",["3"])];

        let results = await contract_that_calls_deployed.multiCall(addresses, data);
        console.log(results);

    })

})