require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [process.env.PRIVATE_KEY]
    },
    goerli: {
      url: "https://goerli.infura.io/v3/" + process.env.API_INFURA,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
