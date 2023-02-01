require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",

  networks: {
    goerli: {
      url: "https://goerli.infura.io/v3/" + process.env.API_INFURA,
      accounts: [process.env.PRIVATE_KEY]
    },
    fantom_testnet: {
      url: "https://rpc.testnet.fantom.network",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
