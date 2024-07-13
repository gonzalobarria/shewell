import { defaultWagmiConfig } from "@web3modal/wagmi/react/config"

import { cookieStorage, createStorage } from "wagmi"
import {
  scrollSepolia,
  morphHolesky,
  zircuitTestnet,
  arbitrumSepolia,
  hardhat,
} from "wagmi/chains"

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) throw new Error("Project ID is not defined")

const metadata = {
  name: "SheWell",
  description: 'AppKit Example',
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
}

const chains = [
  hardhat,
  scrollSepolia,
  morphHolesky,
  zircuitTestnet,
  arbitrumSepolia,
] as const

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: false,
  auth: { email: false },
  storage: createStorage({
    storage: cookieStorage,
  }),
})
