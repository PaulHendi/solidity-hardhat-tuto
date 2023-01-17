const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("Test interface", () => {

    let contract, contract_called;
    let contract_deployed, contract_called_deployed;

    let contract_called_address;

    let count;


    it("should test inc and dec", async() => {

        contract_called = await ethers.getContractFactory("Test");
        contract_called_deployed = await contract_called.deploy();
        contract_called_address = contract_called_deployed.address;

        contract = await ethers.getContractFactory("CallInterface");
        contract_deployed = await contract.deploy();

        await contract_deployed.inc(contract_called_address);
        await contract_deployed.inc(contract_called_address);
        await contract_deployed.dec(contract_called_address);
        await contract_deployed.dec(contract_called_address);
        await contract_deployed.inc(contract_called_address);
        count = await contract_deployed.count(contract_called_address);
        expect(count).to.equal(1);


        await contract_deployed.inc(contract_called_address);
        await contract_deployed.inc(contract_called_address);
        await contract_deployed.dec(contract_called_address);
        count = await contract_deployed.count(contract_called_address);
        expect(count).to.equal(2);

    })


})