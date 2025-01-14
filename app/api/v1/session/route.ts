import { db } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";
import { auth } from "@/auth";
import { sendMail } from "@/actions/mail";
import { createCalendarEvent } from "@/actions/calendar";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");
    const limitParam = searchParams.get("limit");

    if (dateParam) {
      const dateSchema = Joi.date();
      const { error } = dateSchema.validate(dateParam);

      if (error) {
        return NextResponse.json(
          { error: "Invalid date parameter" },
          { status: 400 }
        );
      }
    }

    let limit = undefined;
    if (limitParam) {
      const limitSchema = Joi.number().integer().positive();
      const { error, value } = limitSchema.validate(limitParam);

      if (error) {
        return NextResponse.json(
          { error: "Invalid limit parameter" },
          { status: 400 }
        );
      }

      limit = value;
    }

    const dateFilter = dateParam ? { date: { gt: new Date(dateParam) } } : {};

    const sessions = await db.session.findMany({
      where: dateFilter,
      orderBy: {
        date: "asc",
      },
      take: limit,
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to get sessions" },
      { status: 500 }
    );
  }
}

const postSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional().allow(null),
  date: Joi.date().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  resources: Joi.array()
    .items(
      Joi.object({
        type: Joi.string().valid("pdf", "image", "video").required(),
        url: Joi.string().uri().required(),
      })
    )
    .optional(),
  guests: Joi.array().items(Joi.string().email()).optional(),
  image: Joi.string().uri().optional(),
});

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { error, value } = postSchema.validate(body);

//     if (error) {
//       return NextResponse.json(
//         { message: error.details[0].message },
//         { status: 400 }
//       );
//     }

//     const { title, description, startTime, endTime, date, guests, image } =
//       value;

//     const session = await auth();
//     if (!session) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const userId = session.user.id;

//     // Create session in database
//     const newSession = await db.session.create({
//       data: {
//         title,
//         description,
//         date: new Date(date),
//         startTime,
//         endTime,
//         userId: userId.toString(),
//         guests: guests || [],
//         image,
//       },
//     });

//     // Create Google Calendar event
//     try {
//       const calendarEvent = await createCalendarEvent({
//         userId,
//         title,
//         description,
//         startTime,
//         endTime,
//         date,
//         guests,
//       });

//       await db.session.update({
//         where: { id: newSession.id },
//         data: { calendarEventId: calendarEvent.id },
//       });
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//       if (error.message.includes("expired")) {
//         console.log("User needs to reconnect Google Calendar");
//       } else if (error.message === "User not connected to Google Calendar") {
//         console.log("User needs to connect Google Calendar");
//       } else {
//         console.error("Failed to create calendar event:", error);
//       }
//     }

//     // Send email notifications
//     if (guests && guests.length > 0) {
//       for (const guest of guests) {
//         const emailContent = `
//           <h1>You are invited to a session</h1>
//           <p>Title: ${title}</p>
//           <p>Date: ${date}</p>
//           <p>Start Time: ${startTime}</p>
//           <p>End Time: ${endTime}</p>
//           <p>Description: ${description}</p>
//         `;
//         await sendMail("You're Invited!", guest, emailContent);
//       }
//     }

//     return NextResponse.json(newSession, { status: 201 });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       { message: "Failed to create a session" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { error, value } = postSchema.validate(body);

    if (error) {
      return NextResponse.json(
        { message: error.details[0].message },
        { status: 400 }
      );
    }

    const { title, description, startTime, endTime, date, guests, image } =
      value;

    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const POINTS_FOR_SESSION = 50; // Define points constant

    // Use a transaction to ensure both session creation and points are updated atomically
    const [newSession, pointsRecord] = await db.$transaction(async (tx) => {
      // Create session
      const createdSession = await tx.session.create({
        data: {
          title,
          description,
          date: new Date(date),
          startTime,
          endTime,
          userId: userId.toString(),
          guests: guests || [],
          image,
        },
      });

      // Find existing points record or create new one
      const existingPoints = await tx.points.findFirst({
        where: {
          userId: userId.toString(),
          type: "SESSION_POINTS",
        },
      });

      let updatedPoints;
      if (existingPoints) {
        // Update existing points record
        updatedPoints = await tx.points.update({
          where: { id: existingPoints.id },
          data: {
            value: existingPoints.value + POINTS_FOR_SESSION,
          },
        });
      } else {
        // Create new points record
        updatedPoints = await tx.points.create({
          data: {
            userId: userId.toString(),
            type: "SESSION_POINTS",
            value: POINTS_FOR_SESSION,
            reason: "Points from creating sessions",
          },
        });
      }

      // Create activity log entry for points
      await tx.activityLog.create({
        data: {
          userId: userId.toString(),
          action: "POINTS_EARNED",
          targetId: createdSession.id,
          metadata: {
            points: POINTS_FOR_SESSION,
            reason: "Created a new session",
            newTotal: updatedPoints.value,
          },
        },
      });

      return [createdSession, updatedPoints];
    });

    // Create Google Calendar event
    try {
      const calendarEvent = await createCalendarEvent({
        userId,
        title,
        description,
        startTime,
        endTime,
        date,
        guests,
      });

      await db.session.update({
        where: { id: newSession.id },
        data: { calendarEventId: calendarEvent.id },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message.includes("expired")) {
        console.log("User needs to reconnect Google Calendar");
      } else if (error.message === "User not connected to Google Calendar") {
        console.log("User needs to connect Google Calendar");
      } else {
        console.error("Failed to create calendar event:", error);
      }
    }

    // Send email notifications
    if (guests && guests.length > 0) {
      for (const guest of guests) {
        const emailContent = `
          <h1>You are invited to a session</h1>
          <p>Title: ${title}</p>
          <p>Date: ${date}</p>
          <p>Start Time: ${startTime}</p>
          <p>End Time: ${endTime}</p>
          <p>Description: ${description}</p>
        `;
        await sendMail("You're Invited!", guest, emailContent);
      }
    }

    return NextResponse.json(
      {
        session: newSession,
        pointsAwarded: POINTS_FOR_SESSION,
        totalPoints: pointsRecord.value,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create a session" },
      { status: 500 }
    );
  }
}
