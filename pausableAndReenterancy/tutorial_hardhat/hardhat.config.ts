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
      accounts: ['b9bcabd57d7c5f862ebdb82ac75df048349599658450e502955c83bd7da595c3','519b4ac51ec05a12791059df188fce593a298451438ad77d697bdf08a29667da', '91e0980965779d982056537bb332909886f659be16f9ba4368a4a63e35dfc7ac']
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
      accounts: [process.env.PRIVATE_KEY!, process.env.TEST_PRIVATE_KEY!, process.env.TEST_PRIVATE_KEY2!]
    }
  },
  solidity: {
    version : "0.8.13",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      }
    }
  },
  gasReporter: {
    enabled: true,
    // currency: "KRW",
  },
};

export default config;
