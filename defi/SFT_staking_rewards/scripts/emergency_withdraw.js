const {ethers} = require("hardhat");


async function main() {

    // Get the Stacking contract
    let staking_contract = await ethers.getContractFactory("StakingRewards");
    let staking_contract_deployed = await staking_contract.attach("0xD865A163dDA1ea13A85F58c73878EC11a87e8dAd");
    
    await staking_contract_deployed.emergencyWithdraw();

}


main().then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });