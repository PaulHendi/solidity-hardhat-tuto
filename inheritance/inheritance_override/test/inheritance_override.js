const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("Test inheritance override", () => {

    let contract_A, contract_B;
    let contract_A_Deployed, contract_B_Deployed;

    let foo, bar;

    it("should test inheritance",async() => {

        contract_A = await ethers.getContractFactory("A");
        contract_A_Deployed = await contract_A.deploy();

        contract_B = await ethers.getContractFactory("B");
        contract_B_Deployed = await contract_B.deploy(); 
        
        foo = await contract_A_Deployed.foo();
        expect(foo).to.equal("A");
        bar = await contract_A_Deployed.bar();
        expect(bar).to.equal("A");

        foo = await contract_B_Deployed.foo();
        expect(foo).to.equal("B");
        bar = await contract_B_Deployed.bar();
        expect(bar).to.equal("B");

    })

})