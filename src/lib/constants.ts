import {
  scrollSepolia,
  morphHolesky,
  zircuitTestnet,
  arbitrumSepolia,
  hardhat,
} from "wagmi/chains"

export const CONTRACT_ADDRESSES: { [chainId: number]: string } = {
  [hardhat.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  [morphHolesky.id]: "0x9fF04b2d1be38783D0CAb05205C3caD3D0D71208",
  [zircuitTestnet.id]: "0xf7E0900FA9bA0768686ed6e24c2e4D8a3473C7D7",
  [scrollSepolia.id]: "0x073c7F27358E219383C3c2b55A6a0fFC39B9e02F",
  [arbitrumSepolia.id]: "0x2c1279586FA10bB4C2ec19B15Da48e757aDb674a",
}

export const algorithm = "aes-256-cbc"
