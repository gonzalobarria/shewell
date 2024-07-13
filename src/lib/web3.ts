import { Interface, InterfaceAbi, ethers } from "ethers"

export const getSignedContract = async (
  address: string,
  contractAddress: string,
  ABI: Interface | InterfaceAbi
): Promise<ethers.Contract> => {
  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner(address)

  return new ethers.Contract(contractAddress, ABI, signer)
}
