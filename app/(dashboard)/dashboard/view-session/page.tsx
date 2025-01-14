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
        .map(Number);
      const [endHour, endMinute] = session?.endTime?.split(":").map(Number);

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
                <div>
                  <p>
                    <strong>User ID:</strong> {selectedEvent?.userId}
                  </p>
                  {/* <p>
                    <strong>Guests:</strong>{" "}
                    {selectedEvent?.guests?.length > 0
                      ? selectedEvent.guests.join(", ")
                      : "No guests invited"}
                  </p> */}
                  <p>
                    <strong>Start Time:</strong>{" "}
                    {format(selectedEvent?.start || "", "MMMM d, yyyy h:mm a")}
                  </p>
                  <p>
                    <strong>End Time:</strong>{" "}
                    {format(selectedEvent?.end || "", "MMMM d, yyyy h:mm a")}
                  </p>
                  <p>
                    <strong>Description:</strong>{" "}
                    {selectedEvent?.description || "No description available"}
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
