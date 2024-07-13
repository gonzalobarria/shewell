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
  getMCTList: () => Promise<SheWell.MenstrualCycleTrackingStruct[] | undefined>
  addMCTItem: (
    title: string,
    eventDate: number,
    content: string
  ) => Promise<void>
  modifyMCTItem: (id: number, title: string, content: string) => Promise<void>
  getLastMCTID: () => Promise<number | undefined>
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
        }
      } else {
        // router.push("/")
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

  const getMCTList = async (): Promise<
    SheWell.MenstrualCycleTrackingStruct[] | undefined
  > => {
    if (!contract) return

    return await contract.getMCTList()
  }

  const addMCTItem = async (
    title: string,
    eventDate: number,
    content: string
  ): Promise<void> => {
    if (!contract) return

    const tx1 = await contract.addMCTItem(title, eventDate, content)
    await tx1.wait()
  }

  const modifyMCTItem = async (
    id: number,
    title: string,
    content: string
  ): Promise<void> => {
    if (!contract) return

    const tx1 = await contract.modifyMCTItem(id, title, content)
    await tx1.wait()
  }

  const getLastMCTID = async (): Promise<number | undefined> => {
    if (!contract) return

    return await contract.getLastMCTID()
  }

  return (
    <SheWellContext.Provider
      value={{
        contract,
        registerUser,
        getMyUserInfo,
        userInfo,
        getMCTList,
        addMCTItem,
        modifyMCTItem,
        getLastMCTID,
      }}
    >
      {children}
    </SheWellContext.Provider>
  )
}

export default SheWellProvider
export const useSheWellContext = () =>
  useContext(SheWellContext) as SheWellContextType
