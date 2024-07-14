import { Event } from "react-big-calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Dispatch, SetStateAction } from "react"
import McFollow from "./forms/mcFollow"

type ModalCalProps = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
  addEvent: (obj: any) => void
  event?: Event & { id: number }
}

export function ModalCal({ open, setOpen, addEvent, event, isLoading, setIsLoading }: ModalCalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>What&apos;s new Today?</DialogTitle>
          <DialogDescription>Choose all that matters most</DialogDescription>
        </DialogHeader>
        <McFollow addEvent={addEvent} event={event} isLoading={isLoading} setIsLoading={setIsLoading} />
      </DialogContent>
    </Dialog>
  )
}
