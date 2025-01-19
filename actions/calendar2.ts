// calendar.ts
import { google } from "googleapis";
import { db } from "@/prisma";

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

  // Create OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  // Set credentials
  oauth2Client.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
  });

  // Handle token refresh if needed
  oauth2Client.on("tokens", async (tokens) => {
    if (tokens.refresh_token) {
      // Update refresh token in database
      await db.account.update({
        where: {
          id: account.id,
        },
        data: {
          refresh_token: tokens.refresh_token,
        },
      });
    }
    if (tokens.access_token) {
      // Update access token in database
      await db.account.update({
        where: {
          id: account.id,
        },
        data: {
          access_token: tokens.access_token,
        },
      });
    }
  });

  return oauth2Client;
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
  startTime: string;
  endTime: string;
  date: Date | string;
  guests?: string[];
}) {
  try {
    const auth = await getAccessToken(userId);

    const calendar = google.calendar({
      version: "v3",
      auth,
    });

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === 401) {
      // Handle unauthorized error - might need to redirect to re-auth
      throw new Error(
        "Calendar authorization expired. Please reconnect your Google account."
      );
    }
    console.error("Failed to create calendar event:", error);
    throw error;
  }
}
