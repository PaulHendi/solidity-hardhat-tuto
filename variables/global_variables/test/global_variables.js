const {ethers} = require("hardhat")

describe("Test global variables", () => {
    
    it("Should print some global variables", async () => {

        const contract = await ethers.getContractFactory("GlobalVariables");
        const contractDeployed = await contract.deploy();

        const sender = await contractDeployed.returnSender();
        const timestamp = await contractDeployed.returnTimestamp();
        const blocknum = await contractDeployed.returnBlockNum();
        const blockhash = await contractDeployed.returnBlockHash();

        console.log("\t sender : %s \n\t timestamp : %s \n\t blocknum : %s \n\t blockhash : %s", sender, timestamp, blocknum, blockhash);

    })
})