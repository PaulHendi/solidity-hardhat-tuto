const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("Test call", () => {

    let contract_called, contract_main;
    let contract_called_deployed, contract_main_deployed;

    let contract_called_address;

    beforeEach(async() => {

        contract_called = await ethers.getContractFactory("TestCall");
        contract_called_deployed = await contract_called.deploy();
        contract_called_address = contract_called_deployed.address;

        contract_main = await ethers.getContractFactory("Call");
        contract_main_deployed = await contract_main.deploy();

    })

    it("should call foo and doesNotExist", async() => {

        await contract_main_deployed.callFoo(contract_called_address);

        await contract_main_deployed.callDoesNotExist(contract_called_address);
        

    })

    it("should call bar", async () => {

        let barWasCalled = await contract_called_deployed.barWasCalled();
        expect(barWasCalled).to.equal(false);
        await contract_main_deployed.callBar(contract_called_address);
        barWasCalled = await contract_called_deployed.barWasCalled();
        expect(barWasCalled).to.equal(true);

    })

})