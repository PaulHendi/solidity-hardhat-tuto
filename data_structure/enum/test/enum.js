const {ethers} = require("hardhat");
const {expect} = require("chai");

describe('Test enum', () => { 

    let contract;
    let contractDeployed;

    let status = {0:"None", 1:"Pending",2:"Shipped",3:"Completed",4:"Rejected",5:"Cancelled"};
    let curr_status;


    it("should set states for enum status", async() => {

        contract = await ethers.getContractFactory("EnumExamples");
        contractDeployed = await contract.deploy();

        curr_status = await contractDeployed.get();
        expect(status[curr_status]).to.equal("None")

        await contractDeployed.set(1);
        curr_status = await contractDeployed.get();
        expect(status[curr_status]).to.equal("Pending")

        await contractDeployed.ship();
        curr_status = await contractDeployed.get();
        expect(status[curr_status]).to.equal("Shipped")

        await contractDeployed.set(3);
        curr_status = await contractDeployed.get();
        expect(status[curr_status]).to.equal("Completed")  
        
        await contractDeployed.set(4);
        curr_status = await contractDeployed.get();
        expect(status[curr_status]).to.equal("Rejected")


        await contractDeployed.cancel();
        curr_status = await contractDeployed.get();
        expect(status[curr_status]).to.equal("Cancelled")


        await contractDeployed.reset();
        curr_status = await contractDeployed.get();
        expect(status[curr_status]).to.equal("None")



    })

 })