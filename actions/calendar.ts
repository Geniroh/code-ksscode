import { google } from "googleapis";
import { db } from "@/prisma";

async function getAccessToken(userId: string) {
  const account = await db.account.findFirst({
    where: {
      userId,
      provider: "google",
    },
  });

  if (!account?.access_token) {
    throw new Error("User not connected to Google Calendar");
  }

  return account.access_token;
}

function createEventDateTime(baseDate: Date | string, timeStr: string): string {
  try {
    const date = baseDate instanceof Date ? baseDate : new Date(baseDate);

    const [hours, minutes] = timeStr.split(":").map(Number);

    const eventDate = new Date(date);
    eventDate.setHours(hours, minutes, 0, 0);

    return eventDate.toISOString();
  } catch (error) {
    console.error("Error creating event datetime:", {
      baseDate,
      timeStr,
      error,
    });
    throw new Error(`Invalid date/time combination: ${baseDate} ${timeStr}`);
  }
}

export async function createCalendarEvent({
  userId,
  title,
  description,
  startTime,
  endTime,
  date,
  guests,
}: {
  userId: string;
  title: string;
  description?: string;
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
  date: Date | string;
  guests?: string[];
}) {
  try {
    const accessToken = await getAccessToken(userId);

    const calendar = google.calendar({
      version: "v3",
      auth: accessToken,
    });

    // Get local timezone
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const event = {
      summary: title,
      description,
      start: {
        dateTime: createEventDateTime(date, startTime),
        timeZone,
      },
      end: {
        dateTime: createEventDateTime(date, endTime),
        timeZone,
      },
      attendees: guests?.map((email) => ({ email })),
      reminders: {
        useDefault: true,
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      sendUpdates: "all",
    });

    return response.data;
  } catch (error) {
    console.error("Failed to create calendar event:", error);
    throw error;
  }
}
