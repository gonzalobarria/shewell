import SWCalendar from "@/components/web/general/calendar"

const CalendarComponent = () => {
  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 max-w-4xl mx-auto bg-background m-8 shadow-lg rounded-lg">
      <SWCalendar />
    </div>
  )
}

export default CalendarComponent
