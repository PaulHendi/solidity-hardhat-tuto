const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("Test state variables", () => {

    let StateVariables;
    let StateVariablesDeployed;

    beforeEach(async () => {
        StateVariables = await ethers.getContractFactory("StateVariables");
        StateVariablesDeployed = await StateVariables.deploy();
    })

    it("should get 0 as an initial default value of num", async () => {

        const numFromOwnGetter = await StateVariablesDeployed.getNum();
        const numFromDefaultGetter = await StateVariablesDeployed.num(); // Default getter for a public variable

        expect(numFromOwnGetter).to.equal(0); 
        expect(numFromDefaultGetter).to.equal(0); 

    })

    it("should set 5 as a new num and reset", async () => {

        await StateVariablesDeployed.setNum(5);
        let num = await StateVariablesDeployed.num(); 

        expect(num).to.equal(5); 

        await StateVariablesDeployed.resetNum();
        num = await StateVariablesDeployed.num(); 

        expect(num).to.equal(0);         

    })   
    
    it("should set 10 as a new num and return 11 with custom getNumPlusOne function", async () => {

        await StateVariablesDeployed.setNum(10);
        let num = await StateVariablesDeployed.num(); 

        expect(num).to.equal(10); 

        num = await StateVariablesDeployed.getNumPlusOne();
        expect(num).to.equal(11);         

    })       
})