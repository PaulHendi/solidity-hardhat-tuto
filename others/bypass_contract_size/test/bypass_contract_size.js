const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("Test bypass contract size", () => {

    let no_contract, classic_contract, bypass_contract_size;
    let no_contract_deployed, classic_contract_deployed, bypass_contract_size_deployed;


    beforeEach(async() => {

        no_contract = await ethers.getContractFactory("NoContract");
        classic_contract = await ethers.getContractFactory("ClassicContract");
        bypass_contract_size = await ethers.getContractFactory("NoContractExploit");

        no_contract_deployed = await no_contract.deploy();
        classic_contract_deployed = await classic_contract.deploy(no_contract_deployed.address);
        bypass_contract_size_deployed = await bypass_contract_size.deploy(no_contract_deployed.address);

    })

    it("should fail at calling the fallback of no_contract.sol", async() => {

        const success = await classic_contract_deployed.pwn();  // No contract allowed
        console.log(success);  // No boolean, due to call function ?

    })

    it("should succeed at calling the fallback of no_contract.sol", async() => {

        await bypass_contract_size_deployed.pwn();  
        
    })    


})