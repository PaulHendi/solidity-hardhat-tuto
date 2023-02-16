const {ethers} = require("hardhat");


async function main() {

    // Get the Stacking contract
    let staking_contract = await ethers.getContractFactory("StakingRewards");
    let staking_contract_deployed = await staking_contract.attach("0x463Ca0074E8D6bB4345286879Fe53E13cAdD5049");
    
    const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/fantom_testnet");


    owner = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    alice = new ethers.Wallet(process.env.PRIVATE_KEY_ALICE, provider);
    bob = new ethers.Wallet(process.env.PRIVATE_KEY_BOB, provider);

    await staking_contract_deployed.unstake(1);
    await staking_contract_deployed.connect(alice).unstake(2);
    await staking_contract_deployed.connect(bob).unstake(3);

}


main().then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });