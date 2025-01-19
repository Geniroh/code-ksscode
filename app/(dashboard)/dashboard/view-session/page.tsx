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
import { RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Extend BigCalendarEvent with our custom properties
interface CalendarEvent extends BigCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  userId: string;
  user?: IUser;
  guests: string[];
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

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

  // Transform data to match react-big-calendar's expected format
  const transformEvents = (sessions: ISession[] = []): CalendarEvent[] => {
    return sessions
      ?.filter((session): session is ISession => {
        // Filter out invalid sessions
        return Boolean(
          session &&
            session.date &&
            session.startTime &&
            session.endTime &&
            session.title
        );
      })
      ?.map((session) => {
        try {
          const startDate = new Date(session.date);

          const [startHour = 0, startMinute = 0] = session.startTime
            ?.split(":")
            ?.map(Number) || [0, 0];

          const [endHour = 0, endMinute = 0] = session.endTime
            ?.split(":")
            ?.map(Number) || [0, 0];

          const start = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            startHour,
            startMinute
          );

          const end = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            endHour,
            endMinute
          );

          // Validate the created dates
          if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            console.warn("Invalid date created for session:", session);
            return null;
          }

          // Create a properly typed calendar event
          const calendarEvent: CalendarEvent = {
            ...session,
            title: session.title || "Untitled Session",
            start,
            end,
            guests: session.guests || [],
            user: session.user || undefined,
            allDay: false, // Add required BigCalendarEvent property
            resource: null, // Add required BigCalendarEvent property
          };

          return calendarEvent;
        } catch (err) {
          console.error("Error transforming session:", session, err);
          return null;
        }
      })
      ?.filter((event): event is CalendarEvent => event !== null);
  };

  const events = transformEvents(data || []);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading sessions. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const formatEventDate = (date: Date | string | undefined) => {
    if (!date) return "Date not available";
    try {
      return format(new Date(date), "MMMM d, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const formatEventTime = (date: Date | undefined) => {
    if (!date) return "Time not available";
    try {
      return format(date, "h:mm a");
    } catch {
      return "Invalid time";
    }
  };

  return (
    <div className="bg-white p-6">
      {isLoading && (
        <div className="flex gap-2 items-center leading-6 py-2 text-sm">
          <RefreshCw size={12} className="text-heading animate-spin" /> Loading
          Sessions...
        </div>
      )}

      <Calendar
        localizer={localizer}
        events={events}
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
            <DialogTitle className="capitalize">
              {selectedEvent?.title || "Event Details"}
            </DialogTitle>
            <DialogDescription>
              {selectedEvent ? (
                <div className="space-y-3 mt-2">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={selectedEvent?.user?.image}
                        alt={selectedEvent?.user?.name || "User Avatar"}
                      />
                      <AvatarFallback>
                        {selectedEvent?.user?.name
                          ? selectedEvent.user.name.charAt(0).toUpperCase()
                          : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>{selectedEvent?.user?.name || "Anonymous User"}</div>
                  </div>

                  <div>
                    <h1 className="text-heading">Description:</h1>
                    {selectedEvent?.description || "No description available"}
                  </div>

                  <div>
                    <h1 className="text-heading">Date:</h1>
                    {formatEventDate(selectedEvent?.date)}
                  </div>

                  <div>
                    <h1 className="text-heading">Duration:</h1>
                    {formatEventTime(selectedEvent?.start)} -{" "}
                    {formatEventTime(selectedEvent?.end)}
                  </div>

                  <div>
                    <h1 className="text-heading">Guests:</h1>
                    {selectedEvent?.guests?.length > 0
                      ? selectedEvent.guests.join(", ")
                      : "No guests invited"}
                  </div>
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
