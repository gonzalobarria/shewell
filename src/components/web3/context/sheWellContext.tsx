import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { SheWell } from "@/components/abis/types/SheWell"
import SheWellAbi from "@/components/abis/SheWell.json"
import useContract from "@/hooks/useContract"
import { CONTRACT_ADDRESSES } from "@/lib/constants"
import { useChainId } from "wagmi"
import { useRouter } from "next/router"
import { ethers } from "ethers"

type SheWellProviderProps = {
  children: ReactNode
}

type SheWellContextType = {
  contract: ethers.Contract | null
  getMyUserInfo: () => Promise<SheWell.UserStruct | undefined>
  userInfo: SheWell.UserStruct | undefined
  registerUser: (name: string, content: string) => Promise<void>
}

export const SheWellContext = createContext<SheWellContextType | null>(null)

const SheWellProvider = ({ children }: SheWellProviderProps) => {
  const router = useRouter()
  const chainId = useChainId()
  const [userInfo, setUserInfo] = useState<SheWell.UserStruct>()
  const { contract, isConnected } = useContract({
    contractAddress: CONTRACT_ADDRESSES[chainId],
    ABI: SheWellAbi.abi,
  })

  useEffect(() => {
    const asyncFunc = async () => {
      if (isConnected && contract) {
        const userI = await contract.getMyUserInfo()

        if (!userI.name) router.push("/register")
        else {
          setUserInfo(userI)
          router.push("/dashboard")
        }
      } else {
        router.push("/")
      }
    }

    asyncFunc()
  }, [isConnected, contract])

  const registerUser = async (name: string, content: string): Promise<void> => {
    if (!contract) return

    const tx1 = await contract.registerUser(name, content)
    await tx1.wait()
  }

  const getMyUserInfo = async (): Promise<SheWell.UserStruct | undefined> => {
    if (!contract) return

    return await contract.getMyUserInfo()
  }

  return (
    <SheWellContext.Provider
      value={{ contract, registerUser, getMyUserInfo, userInfo }}
    >
      {children}
    </SheWellContext.Provider>
  )
}

export default SheWellProvider
export const useSheWellContext = () =>
  useContext(SheWellContext) as SheWellContextType
