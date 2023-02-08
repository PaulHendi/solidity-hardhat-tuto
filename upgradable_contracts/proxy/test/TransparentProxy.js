const {ethers} = require("hardhat");

describe("TransparentProxy", function () {

    let counterV1, counterV2, buggyProxy, proxy;
    let counterV1_deployed, counterV2_deployed, buggyProxy_deployed, proxy_deployed;

    let owner;
    let counter;
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

        // 1) Let's first test buggy proxy with the counterV1 contract
        await buggyProxy_deployed.upgradeTo(counterV1_deployed.address);

        iface = new ethers.utils.Interface(counterV1_deployed.interface.format());
        data = await iface.encodeFunctionData("count", []);

        // TODO : need to find a way to get the return value of the function (currently only tx info is returned)
        res = await owner.sendTransaction({to: counterV1_deployed.address, data : data});

        data = await iface.encodeFunctionData("inc", []);
        res = await owner.sendTransaction({to: counterV1_deployed.address, data : data});

        // 2) Now let's test the proxy pattern with the counterV1 contract
        await proxy_deployed.upgradeTo(counterV1_deployed.address);
        data = await iface.encodeFunctionData("inc", []);
        res = await owner.sendTransaction({to: counterV1_deployed.address, data : data});

        res = await counterV1_deployed.count();
        console.log("CounterV1 count: ", res.toString());


    });

});