// @ts-nocheck
import { Calendar, Event, SlotInfo, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"

import { useCallback, useEffect, useMemo, useState } from "react"
import { ModalCal } from "../app/modalCal"
import { useSheWellContext } from "@/components/web3/context/sheWellContext"
import { decrypt, listCID } from "@/lib/uploadIPFS"

const localizer = momentLocalizer(moment)

const SWCalendar = () => {
  const { views } = useMemo(() => ({ views: { month: true } }), [])
  const [event, setEvent] = useState<Event & { id: number }>()
  const [startEvent, setStartEvent] = useState<Date>()
  const [isLoading, setIsLoading] = useState(false)

  const [open, setOpen] = useState(false)
  const { getMCTList, addMCTItem, modifyMCTItem, getLastMCTID, contract } =
    useSheWellContext()
  const [myEvents, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const asyncFunc = async () => {
      if (!contract) return
      const mctListTmp = await getMCTList()
      const mctList = await Promise.all(
        mctListTmp?.map(async (e) => {
          const response = await fetch(`/api/uploadIPFS?cid=${e.content}`)
          const { resource } = await response.json()

          return {
            id: parseInt(e.id.toString()),
            title: e.title,
            start: moment(parseInt(e.eventDate.toString() + "000"))
              .startOf("day")
              .toDate(),
            end: moment(parseInt(e.eventDate.toString() + "000"))
              .add(1, "d")
              .startOf("day")
              .toDate(),
            resource: JSON.parse(resource),
          }
        }) as Event[]
      )
      setEvents(mctList || [])
    }
    asyncFunc()
  }, [contract])

  useEffect(() => {
    if (!open) setEvent(undefined)
  }, [open])

  const handleSelectSlot = useCallback(
    ({ start, end, action }: SlotInfo) => {
      if (
        action !== "click" ||
        myEvents.findIndex((ev) => moment(start).isSame(ev.start)) !== -1
      )
        return

      setStartEvent(start)
      setOpen(true)
    },
    [setEvents, myEvents]
  )

  const handleSelectEvent = useCallback((e: Event & { id: number }) => {
    setEvent(e)
    setOpen(true)
  }, [])

  const eventStyleGetter = () => {
    let backgroundColor = "#FFD3D3"

    const style = {
      backgroundColor,
      borderColor: backgroundColor,
      display: "flex",
      justifyContent: "center",
      height: "44px",
      alignItems: "center",
    }

    return { style }
  }

  return (
    <>
      <Calendar
        localizer={localizer}
        events={myEvents}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        style={{ height: 500 }}
        views={views}
        selectable
        eventPropGetter={eventStyleGetter}
      />
      <ModalCal
        open={open}
        setOpen={setOpen}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
        addEvent={async (event) => {
          const previousEvents = myEvents.filter(
            (me) => me.start !== event.start
          )
          if (previousEvents.length < myEvents.length) {
            setEvents(() => [
              ...previousEvents,
              {
                ...event,
                start: moment(event.start).startOf("day").toDate(),
                end: moment(event.start).add(1, "d").startOf("day").toDate(),
              },
            ])
            await modifyMCTItem(event.id, event.title, event.content)
          } else {
            await addMCTItem(
              event.title,
              moment(startEvent).startOf("day").unix(),
              event.content
            )

            const lastMCTID = await getLastMCTID()

            setEvents((prevEvent) => [
              ...prevEvent,
              {
                ...event,
                id: lastMCTID,
                start: moment(startEvent).startOf("day").toDate(),
                end: moment(startEvent).add(1, "d").startOf("day").toDate(),
              },
            ])
          }
          setIsLoading(false)
          setOpen(false)
        }}
        event={event}
      />
    </>
  )
}

export default SWCalendar
