import SWCalendar from "@/components/web/general/calendar"

const CalendarComponent = () => {
  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 max-w-4xl mx-auto bg-background m-8 shadow-lg rounded-lg gap-y-4">
      <h1 className="text-xl font-semibold text-center">My Calendar</h1>
      <SWCalendar />
    </div>
  )
}

export default CalendarComponent
