const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("Test calling parent functions", () => {

    let contract_E, contract_F, contract_G, contract_H;
    let contract_E_deployed, contract_F_deployed, contract_G_deployed, contract_H_deployed;

    let result;

    beforeEach(async() => {

        contract_E = await ethers.getContractFactory("E");
        contract_F = await ethers.getContractFactory("F");
        contract_G = await ethers.getContractFactory("G");
        contract_H = await ethers.getContractFactory("H");

        contract_E_deployed = await contract_E.deploy();
        contract_F_deployed = await contract_F.deploy();
        contract_G_deployed = await contract_G.deploy();
        contract_H_deployed = await contract_H.deploy();

    })

    it("should first test E", async() => {


        result = await contract_H_deployed.foo();
        console.log(result);


    })

})