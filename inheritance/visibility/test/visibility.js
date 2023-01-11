const {expect} = require("chai");
const {ethers} = require("hardhat");


describe("Test visibility", ()=> {

    let contract_child;
    let contract_child_deployed;
    let result;

    it("should test internal and public functions availability for child classes", async() => {

        contract_child = await ethers.getContractFactory("VisibilityChild");
        contract_child_deployed = await contract_child.deploy();

        await contract_child_deployed.examples2(); // Does not return anything
        result = await contract_child_deployed.test();
        expect(result).to.equal(303)

    })

})