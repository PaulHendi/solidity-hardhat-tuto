const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("Test multiple inheritance", () => {

    let contract_X, contract_Y, contract_Z;
    let contract_X_deployed, contract_Y_deployed, contract_Z_deployed;

    let output;

    it("should test inheritance with its order", async() => {

        contract_X = await ethers.getContractFactory("X");
        contract_X_deployed = await contract_X.deploy();

        contract_Y = await ethers.getContractFactory("Y");
        contract_Y_deployed = await contract_Y.deploy();
        
        contract_Z = await ethers.getContractFactory("Z");
        contract_Z_deployed = await contract_Z.deploy();

        output = await contract_X_deployed.foo();
        console.log(output);
        output = await contract_Y_deployed.foo();
        console.log(output);
        output = await contract_Z_deployed.foo();
        console.log(output);
    })

})