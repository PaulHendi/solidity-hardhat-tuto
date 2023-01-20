const {ethers} = require("hardhat");
const {expect} = require("chai");

describe('Test delegate calls', () => { 

    let contract_called, contract_that_calls;
    let contract_called_deployed, contract_that_calls_deployed;


    it("should Test delegate calls to another contract", async() => {

        contract_called = await ethers.getContractFactory("TestDelegateCall");
        contract_called_deployed = await contract_called.deploy();


        contract_that_calls = await ethers.getContractFactory("DelegateCall");
        contract_that_calls_deployed = await contract_that_calls.deploy();


        const [owner] = await ethers.getSigners();
        const owner_address = await owner.getAddress();

        // 1) Calling the first contract function with a delegate call in the second contract
        await contract_that_calls_deployed.setVars(contract_called_deployed.address, 100);

        // Checking that the variables have been update in the SECOND contract
        let num = await contract_that_calls_deployed.num();
        expect(num).to.equal(100);
        let sender = await contract_that_calls_deployed.sender();
        expect(sender).to.equal(owner_address);

        // 2) Calling the first contract function with a delegate call in the second contract
        await contract_that_calls_deployed.setNum(contract_called_deployed.address, 500);

        // Checking that the variables have been update in the SECOND contract
        num = await contract_that_calls_deployed.num();
        expect(num).to.equal(500);


        // Just for fun, we can check that num in the first contract is still 0 (default value)
        num = await contract_called_deployed.num();
        expect(num).to.equal(0);


    })

 })