require("@nomicfoundation/hardhat-toolbox");

const API_INFURA = "YOUR API KEY"
const PRIVATE_KEY = "YOUR PRIVATE KEY";


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",

  networks: {
  	goerli: {
		url : 	"https://goerli.infura.io/v3/{API_INFURA}",
		accounts : [PRIVATE_KEY]
	}
  }
};
