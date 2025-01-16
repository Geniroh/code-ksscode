"use client";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import type { Event as BigCalendarEvent } from "react-big-calendar";
import { startOfWeek, format, parse, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { useFetchData } from "@/hooks/use-query";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { RefreshCw } from "lucide-react";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type CalendarEvent = BigCalendarEvent & ISession;

const ViewSessionPage = () => {
  const { data, isLoading, error } = useFetchData("/session");

  console.log({ data });

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [view, setView] = useState<
    "month" | "week" | "day" | "agenda" | "work_week"
  >("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  if (error) {
    return <div>Error loading data</div>;
  }

  // Transform data to match react-big-calendar's expected format
  const events =
    data?.map((session: ISession) => {
      const startDate = new Date(session.date);
      const [startHour, startMinute] = session?.startTime
        ?.split(":")
        ?.map(Number);
      const [endHour, endMinute] = session?.endTime?.split(":")?.map(Number);

      return {
        title: session.title,
        start: new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
          startHour,
          startMinute
        ),
        end: new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
          endHour,
          endMinute
        ),
        date: session.date,
        userId: session.userId,
        guests: session.guests,
        description: session.description,
      };
    }) || [];

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event); // Store clicked event details
    setIsDialogOpen(true); // Open dialog
  };

  return (
    <div className="bg-white p-6">
      {isLoading && (
        <div className="flex gap-2 items-center leading-6 py-2 text-sm">
          <RefreshCw size={12} className="text-heading animate-spin" /> Getting
          Sessions...
        </div>
      )}
      <Calendar
        localizer={localizer}
        events={isLoading ? [] : events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleEventClick}
        date={currentDate}
        view={view}
        onNavigate={(date) => setCurrentDate(date)}
        onView={(newView) => setView(newView)}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title || "Event Details"}</DialogTitle>
            <DialogDescription>
              {selectedEvent ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {selectedEvent?.user?.image}
                    <Avatar className="">
                      <AvatarImage
                        src={selectedEvent?.user?.image}
                        alt={selectedEvent?.user?.name || "User Avatar"}
                      />
                      <AvatarFallback>
                        {selectedEvent?.user?.name
                          ? selectedEvent?.user?.name.charAt(0).toUpperCase()
                          : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>{selectedEvent?.user?.name}</div>
                  </div>

                  <div>
                    <h1 className=" text-heading">Description:</h1>
                    {selectedEvent?.description || "No description available"}
                  </div>

                  <div>
                    <h1 className=" text-heading">Date:</h1>
                    {format(selectedEvent?.date || "", "MMMM d, yyyy")}
                  </div>

                  <div>
                    <h1 className=" text-heading">Duration:</h1>
                    {format(selectedEvent?.start || "", "h:mm a")} -{" "}
                    {format(selectedEvent?.end || "", "h:mm a")}
                  </div>

                  <p>
                    <h1 className=" text-heading">Guests:</h1>
                    {selectedEvent?.guests?.length > 0
                      ? selectedEvent.guests.join(", ")
                      : "No guests invited"}
                  </p>
                </div>
              ) : (
                "No event details available."
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewSessionPage;
