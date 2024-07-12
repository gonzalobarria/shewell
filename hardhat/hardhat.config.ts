import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import * as dotenv from "dotenv"

dotenv.config()

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  defaultNetwork: "localhost",
  networks: {
    scrollSepolia: {
      url: process.env.SCROLL_SEPOLIA_TESTNET_URL,
      accounts: [process.env.PRIVATE_KEY || ""],
    },
  },
}

export default config
