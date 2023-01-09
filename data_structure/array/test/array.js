const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("Test array", ()=> {

    it("should test array manipulations (get, push, length, remove)", async ()=> {

        const contract = await ethers.getContractFactory("ArrayBasic");
        const contractDeployed = await contract.deploy();


        await contractDeployed.push(4);
        await contractDeployed.push(5);
        await contractDeployed.push(6);

        let element_index_2 = await contractDeployed.get(2);

        expect(element_index_2).to.equal(6);    
        
        let length_array = await contractDeployed.getLength();

        expect(length_array).to.equal(3);

        await contractDeployed.remove(0);

        element_index_0 = await contractDeployed.get(0);

        expect(element_index_0).to.equal(0);   
        
        length_array = await contractDeployed.getLength();

        expect(length_array).to.equal(3);       
        

    })

})