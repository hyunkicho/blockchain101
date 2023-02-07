import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "dotenv/config";
import "@nomiclabs/hardhat-ethers";

const config: HardhatUserConfig = {
  networks: {
    hardhat: {},
    local: {
      url:'http://127.0.0.1:8545/',
      accounts: ['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80']
    },
    goerli: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY!, process.env.TEST_PRIVATE_KEY!]
    },
    matic: {
      url: process.env.RPC_URL_MATIC,
      accounts: [process.env.PRIVATE_KEY!, process.env.TEST_PRIVATE_KEY!]
    },
    bsc: {
      url: process.env.RPC_URL_BSC,
      accounts: [process.env.PRIVATE_KEY!, process.env.TEST_PRIVATE_KEY!]    
    },
    klaytn: {
      url: process.env.RPC_URL_KLAYTN,
      accounts: [process.env.PRIVATE_KEY!, process.env.TEST_PRIVATE_KEY!]
    }
  },
  solidity: "0.8.13",
  gasReporter: {
    enabled: true,
    // currency: "KRW",
  },
};

export default config;
