const {ethers} = require("hardhat");
const {expect} = require("chai");

describe('Test function selector', () => { 
    
    let contract, contract_attacker;
    let contract_deployed, contract_attacker_deployed;


    it("Should hack function selector main contract", async() => {

        contract = await ethers.getContractFactory("FunctionSelector");
        contract_deployed = await contract.deploy();

        //Get current owner of the contract
        let owner_address = await contract_deployed.owner();

        console.log(owner_address);

        // Now let's hack the contract and change the owner
        contract_attacker = await ethers.getContractFactory("FunctionSelectorExploit");
        contract_attacker_deployed = await contract_attacker.deploy(contract_deployed.address);        

        await contract_attacker_deployed.pwn();

        // Check who's the owner now
        owner_address = await contract_deployed.owner();

        console.log(owner_address);      
        
        // This address should be the address of the attacker's contract
        expect(owner_address).to.equal(contract_attacker_deployed.address)

    })

 })