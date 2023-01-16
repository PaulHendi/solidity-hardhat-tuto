const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("Test todo list", () => {

    let contract;
    let contractDeployed;

    let todo;


    it("should create a todo list and manipulate todos", async () => {

        // Get contract and deploy it
        contract = await ethers.getContractFactory("TodoList");
        contractDeployed = await contract.deploy();

        // Cannot access todos not create yet
        await expect(contractDeployed.get(0)).to.be.reverted;

        // Create todos
        await contractDeployed.create("Feed the dog");
        await contractDeployed.create("Finish homaawork");
        await contractDeployed.create("Take the trash out");

        todo = await contractDeployed.get(1);
        console.log("Todo with error : ",todo);

        // Update todo
        await contractDeployed.updateText(1, "Finish homework");
        
        todo = await contractDeployed.get(1);
        console.log("Corrected todo : ",todo);

        // Set todos to completed
        for (let i=0;i<3;i++) {
            await contractDeployed.toggleCompleted(i)
        }
        
        // Check that todos are completed
        for (let i=0;i<3;i++) {
            todo = await contractDeployed.get(i);
            expect(todo[1]).to.equal(true);
        }        


    })

})