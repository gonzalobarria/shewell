import { useSheWellContext } from "@/components/web3/context/sheWellContext"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/router"
import { toast } from "sonner"

const Dashboard = () => {
  const router = useRouter()
  const { userInfo } = useSheWellContext()
  const [suggestion, setSuggestion] = useState()

  useEffect(() => {
    const asyncFunc = async () => {
      const prompt =
        "Propone actividades deportivas e intelectuales para una mujer que se encuentre en el día 15 de su periodo, de acuerdo a su signo zodiacal donde su fecha de nacimiento es el 20 de enero de 1987. Habla como que le estuvieras aconsejando qué hacer. Escríbelo en un parrafo pequeño, preciso."
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
  }, [])

  return !userInfo ? (
    <div>Loading</div>
  ) : (
    <>
      <div className="flex  flex-row  max-w-4xl   mx-auto gap-8 justify-end">
        {/* <div className="flex   p-4 md:p-8 max-w-4xl  bg-background  shadow-lg rounded-lg gap-8 h-fit mt-8">
          <h2 className="text-xl">
            Today:{" "}
            <span className=" font-semibold">{format(new Date(), "PPP")}</span>
          </h2>
        </div> */}
        <div className="flex flex-col  p-4 md:p-8 max-w-4xl  bg-background mt-8 shadow-lg rounded-lg gap-8 ">
          <h2>
            Welcome <strong>{userInfo.name}</strong>, today{" "}
            <strong>{format(new Date(), "PPP")}</strong> is{" "}
            <strong>day 20</strong> of your cycle
          </h2>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-8 max-w-4xl mx-auto bg-background m-8 shadow-lg rounded-lg gap-y-6">
        <h3 className="text-lg font-semibold">Suggestion for the Day</h3>
        <span>{suggestion}</span>
      </div>
      <div className="flex  flex-row  max-w-4xl my-8   mx-auto gap-8 justify-center">
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
