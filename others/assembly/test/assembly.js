const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("Test assembly", () => {

    let pure_solidity_contract, solidity_assembly_contract;
    let pure_solidity_contract_deployed, solidity_assembly_contract_deployed;


    it("shoudl test equivalent code written in solidity or assembly", async() => {

        pure_solidity_contract = await ethers.getContractFactory("Storage");
        solidity_assembly_contract = await ethers.getContractFactory("StorageAssembly");

        pure_solidity_contract_deployed = await pure_solidity_contract.deploy();
        solidity_assembly_contract_deployed = await solidity_assembly_contract.deploy();


        let val_from_pure_solidity = await pure_solidity_contract_deployed.retrieve();
        let val_from_solidity_assembly = await solidity_assembly_contract_deployed.retrieve();

        expect(val_from_pure_solidity).to.equal(val_from_solidity_assembly);


        await pure_solidity_contract_deployed.store(5);
        await solidity_assembly_contract_deployed.store(5);

        val_from_pure_solidity = await pure_solidity_contract_deployed.retrieve();
        val_from_solidity_assembly = await solidity_assembly_contract_deployed.retrieve();

        expect(val_from_pure_solidity).to.equal(val_from_solidity_assembly);

    })

})