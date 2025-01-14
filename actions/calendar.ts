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

function createDateTimeString(date: string | Date, timeString: string): Date {
  const baseDate = typeof date === "string" ? new Date(date) : date;

  const [hours, minutes] = timeString.split(":").map(Number);

  const dateTime = new Date(baseDate);
  dateTime.setHours(hours, minutes, 0, 0);

  return dateTime;
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
  date: string | Date;
  guests?: string[];
}) {
  try {
    const accessToken = await getAccessToken(userId);

    const calendar = google.calendar({
      version: "v3",
      auth: accessToken,
    });

    const startDateTime = createDateTimeString(date, startTime);
    const endDateTime = createDateTimeString(date, endTime);

    const event = {
      summary: title,
      description,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === 401) {
      throw new Error(
        "Calendar access token expired. User needs to re-authenticate."
      );
    }
    console.error("Error creating calendar event:", error);
    throw error;
  }
}
