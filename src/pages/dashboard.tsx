import { useSheWellContext } from "@/components/web3/context/sheWellContext"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/router"
import { toast } from "sonner"
import { SheWell } from "@/components/abis/types/SheWell"
import moment from "moment"

const Dashboard = () => {
  const router = useRouter()
  const { getMyUserInfo, contract } = useSheWellContext()
  const [suggestion, setSuggestion] = useState()
  const [userInfo, setUserInfo] = useState<SheWell.UserStruct>()
  const [cycleDay, setCycleDay] = useState<number>()

  useEffect(() => {
    const asyncFunc = async () => {
      const userI = await getMyUserInfo()
      setUserInfo(userI)

      if (!userI?.isExists) return

      const resp = await fetch(`/api/uploadIPFS?cid=${userI.content}`)
      let { resource } = await resp.json()
      resource = JSON.parse(resource)

      const fd = moment(new Date(resource.firstDayPeriod))
      const today = moment(new Date().getTime())
      const diffDays = today.diff(fd, "days")

      setCycleDay(diffDays + 1)

      const prompt = `Suggest sports and intellectual activities for a woman who is on the day ${
        diffDays + 1
      } of her cycle, according to her zodiac sign, where her date of birth is ${format(
        new Date(resource.birthdate),
        "PPP"
      )}. Speak as if you were advising her on what to do with a very close and feminine tone, as if you were her friend. Write it in a small, precise paragraph. Do not mention her date of birth in the response.`

      const response = await fetch("/api/cgpt", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      const respuesta = await response.json()
      setSuggestion(respuesta.text)

      console.log("respuesta :>> ", respuesta)
    }

    asyncFunc()
  }, [contract])

  return !userInfo ? (
    <div>Loading</div>
  ) : (
    <>
      <div className="flex flex-row max-w-4xl mx-auto gap-8 justify-end">
        <div className="flex flex-col p-4 md:p-8 max-w-4xl bg-background mt-8 shadow-lg rounded-lg gap-8 ">
          <h2>
            Welcome <strong>{userInfo.name}</strong>, today{" "}
            <strong>{format(new Date(), "PPP")}</strong> is{" "}
            <strong>day {cycleDay}</strong> of your cycle
          </h2>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-8 max-w-4xl mx-auto bg-background m-8 shadow-lg rounded-lg gap-y-6">
        <h3 className="text-lg font-semibold">Suggestion for the Day</h3>
        <span>{suggestion}</span>
      </div>
      <div className="flex flex-row max-w-4xl my-8 mx-auto gap-8 justify-center">
        <Button
          size={"lg"}
          className="text-lg"
          onClick={() => {
            router.push("/calendar")
          }}
        >
          Your Calendar
        </Button>
        <Button
          size={"lg"}
          className="text-lg"
          variant={"outline"}
          onClick={() =>
            toast("Available in Phase 2", {
              description: "Sunday, July 28, 2024",
              action: {
                label: "Close",
                onClick: () => console.log("close"),
              },
            })
          }
        >
          Peer Forum
        </Button>
      </div>
    </>
  )
}

export default Dashboard
