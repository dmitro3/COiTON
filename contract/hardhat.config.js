/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('@nomiclabs/hardhat-ethers')
// const dotenv = require("dotenv")
// dotenv.config();
// const RPC_URL = process.env.RPC_URL;
// const PRIVATE_KEY = process.env.PRIVATE_KEY;
// const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
module.exports = {
  solidity: '0.8.24',

  networks: {
    // sepolia: {
    //   url: RPC_URL,
    //   accounts: [PRIVATE_KEY]
    // },
    anvil: {
      url: "http://localhost:8545",
      accounts: ["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"]
    }
  },
}
