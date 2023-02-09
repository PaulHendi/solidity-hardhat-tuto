const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("TransparentProxy", function () {

    let counterV1, counterV2, buggyProxy, proxy;
    let counterV1_deployed, counterV2_deployed, buggyProxy_deployed, proxy_deployed;

    let owner;
    let iface, data;

    it("Should test the transparent proxy pattern", async function () {

        counterV1 = await ethers.getContractFactory("CounterV1");
        counterV2 = await ethers.getContractFactory("CounterV2");
        buggyProxy = await ethers.getContractFactory("BuggyProxy");
        proxy = await ethers.getContractFactory("Proxy");

        counterV1_deployed = await counterV1.deploy();
        counterV2_deployed = await counterV2.deploy();
        buggyProxy_deployed = await buggyProxy.deploy();
        proxy_deployed = await proxy.deploy();

        [owner] = await ethers.getSigners();
        
        
        // -------------------------------------------------------------------------------
        // 1) Let's first test buggy proxy with the counterV1 contract 
        // -------------------------------------------------------------------------------
        
        // we set the address of the implementation (the logic contract)
        await buggyProxy_deployed.upgradeTo(counterV1_deployed.address);

        // To get the storage of the contract we need to call the getStorageAt function
        storage_at_0 = await ethers.provider.getStorageAt(buggyProxy_deployed.address, 0)
        // Starts at 26 because an address is 40 hex characters (and 0x is 2 characters). Storage is 32 bytes (64 hex)
        storage_at_0 = "0x" + storage_at_0.slice(26); 

        // We can verify that the first storage slot is the address of the counterV1 contract (the implementation)
        expect(storage_at_0).to.equal(counterV1_deployed.address.toLowerCase());

        // Now let's call the inc function of the counterV1 contract via the proxy 
        iface = new ethers.utils.Interface(counterV1_deployed.interface.format());
        data = await iface.encodeFunctionData("inc", []);
        await owner.sendTransaction({to: buggyProxy_deployed.address, data : data});

        // Let's check the storage again
        storage_at_0 = await ethers.provider.getStorageAt(buggyProxy_deployed.address, 0)
        //console.log("Storage at 0: ", storage_at_0); // Was expecting the storage to be 1 actually


        // -------------------------------------------------------------------------------
        // 2) Now let's test the proxy pattern with the counterV1 contract
        // -------------------------------------------------------------------------------

        await proxy_deployed.upgradeTo(counterV1_deployed.address);

        storage_at_0 = await ethers.provider.getStorageAt(proxy_deployed.address, 0)
        expect(storage_at_0).to.equal(ethers.constants.HashZero); // 0 because there are no storage in the proxy contract

        data = await iface.encodeFunctionData("inc", []);
        res = await owner.sendTransaction({to: proxy_deployed.address, data : data});

        storage_at_0 = await ethers.provider.getStorageAt(proxy_deployed.address, 0)
        // storage at 0 = 1 because we incremented the counter in the proxy contract 
        expect(storage_at_0).to.equal(ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 32));
        
        // -------------------------------------------------------------------------------
        // 3) We can check the acutal counterV1 contract storage
        // -------------------------------------------------------------------------------

        res = await counterV1_deployed.count();
        expect(res).to.equal(ethers.constants.HashZero); // 0 because we never updated the counterV1 contract storage


        // -------------------------------------------------------------------------------
        // 4) Now let's test the proxy pattern with the counterV2 contract
        // -------------------------------------------------------------------------------

        await proxy_deployed.upgradeTo(counterV2_deployed.address);

        storage_at_0 = await ethers.provider.getStorageAt(proxy_deployed.address, 0)
        // (Storage at 0) = 1 because the state of the proxy contract remained the same
        expect(storage_at_0).to.equal(ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 32)); 

        // Let's now test the new function with the new implementation
        iface = new ethers.utils.Interface(counterV2_deployed.interface.format());
        data = await iface.encodeFunctionData("dec", []);
        res = await owner.sendTransaction({to: proxy_deployed.address, data : data});

        // Let's check the storage again
        storage_at_0 = await ethers.provider.getStorageAt(proxy_deployed.address, 0)
        // == 0 means the new implementation address was set properly
        expect(storage_at_0).to.equal(ethers.constants.HashZero);




    });

});