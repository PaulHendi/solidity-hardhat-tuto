require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",

  networks: {
    fantom_testnet: {
      url: "https://rpc.ankr.com/fantom_testnet",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
