const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("Test multi delegate", () => {

    let contract;
    let contractDeployed;

    it("should call two methods in the same transaction", async() => {

        contract = await ethers.getContractFactory("TestMultiDelegatecall");
        contractDeployed = await contract.deploy();

        let ABI_func1 = ["function func1(uint x, uint y)"];
        let ABI_func2 = ["function func2()"];

        let iface1 = new ethers.utils.Interface(ABI_func1);
        let iface2 = new ethers.utils.Interface(ABI_func2);


        let data = [iface1.encodeFunctionData("func1", [[1], [2]]),
                    iface2.encodeFunctionData("func2")];

        const results = await contractDeployed.multiDelegatecall(data);

        console.log(results);

    })

})