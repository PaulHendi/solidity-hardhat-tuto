require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "fantom",
  networks: {
    fantom: {
      url: "https://rpc.ankr.com/fantom",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
