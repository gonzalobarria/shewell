import { getSignedContract } from "@/lib/web3"
import { ethers, Interface, InterfaceAbi } from "ethers"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"

type ContractProps = {
  contractAddress: string
  ABI: Interface | InterfaceAbi
}

const useContract = ({ contractAddress, ABI }: ContractProps) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const { isConnected, address } = useAccount()

  useEffect(() => {
    if (!isConnected && contract) {
      setContract(null)
      return
    }

    if (isConnected && !contract) setSheWellContract()
  }, [isConnected, contract])

  const setSheWellContract = async () => {
    if (!isConnected || !address) return

    const signedContract = await getSignedContract(
      address,
      contractAddress,
      ABI
    )

    setContract(signedContract)
  }

  return { contract, address, isConnected }
}

export default useContract
