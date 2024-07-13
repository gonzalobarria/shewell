import { useSheWellContext } from "@/components/web3/context/sheWellContext"

const Dashboard = () => {
  const { userInfo } = useSheWellContext()

  return !userInfo ? (
    <div>Loading</div>
  ) : (
    <div className="flex flex-1 flex-col p-4 md:p-8">
      <h1>My name is {userInfo.name}</h1>
    </div>
  )
}

export default Dashboard
