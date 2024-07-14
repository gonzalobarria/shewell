import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import * as dotenv from "dotenv"

dotenv.config()

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  defaultNetwork: "localhost",
  networks: {
    arbitrum: {
      url: process.env.ALCHEMY_ARBITRUM_URL,
      accounts: [process.env.PRIVATE_KEY || ""],
    },
    morphHolesky: {
      url: process.env.MORPH_HOLESKY_TESTNET_URL,
      accounts: [process.env.PRIVATE_KEY || ""],
    },
    scrollSepolia: {
      url: process.env.SCROLL_SEPOLIA_TESTNET_URL,
      accounts: [process.env.PRIVATE_KEY || ""],
    },
    sepolia: {
      url: process.env.ALCHEMY_SEPOLIA_URL,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    zircuit: {
      url: process.env.ZIRCUIT_TESTNET_URL,
      accounts: [process.env.PRIVATE_KEY || ""],
    },
    calibrationnet: {
      chainId: 314159,
      url: "https://api.calibration.node.glif.io/rpc/v1",
      accounts: [process.env.PRIVATE_KEY || ""],
    },
  },
  etherscan: {
    apiKey: {
      morphHolesky: "anything",
      scrollSepolia: process.env.SCROLL_SEPOLIA_API_KEY || "",
      sepolia: process.env.ETHERSCAN_API_KEY || "",
      zircuit: process.env.ZIRCUIT_API_KEY || "",
    },
    customChains: [
      {
        network: "zircuit",
        chainId: 48899,
        urls: {
          apiURL: "https://explorer.zircuit.com/api/contractVerifyHardhat",
          browserURL: "https://explorer.zircuit.com",
        },
      },
      {
        network: "scrollSepolia",
        chainId: 534351,
        urls: {
          apiURL: "https://api-sepolia.scrollscan.com/api",
          browserURL: "https://sepolia.scrollscan.com/",
        },
      },
      {
        network: "morphHolesky",
        chainId: 2810,
        urls: {
          apiURL: "https://explorer-api-holesky.morphl2.io/api? ",
          browserURL: "https://explorer-holesky.morphl2.io/",
        },
      },
    ],
  },
}

export default config
