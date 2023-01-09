async function main() {

    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const StateVariables = await ethers.getContractFactory("StateVariables");
    const StateVariablesDeployed = await StateVariables.deploy();
  
    console.log("SC address:", StateVariablesDeployed.address);   

}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });