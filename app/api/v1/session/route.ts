import { db } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";
import { auth } from "@/auth";
import { sendMail } from "@/actions/mail";
import { awardPoints } from "@/actions/points";
import { PointScale } from "@/constant/pointscale";
import { sendSlackSessionNotification } from "@/actions/slack";

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
      include: {
        user: true,
      },
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

    // Create session
    const newSession = await db.session.create({
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

    // Award points using the new action
    const pointsRecord = await awardPoints({
      userId: userId.toString(),
      points: PointScale.POINTS_FOR_SESSION,
      type: "SESSION_POINTS",
      reason: "Points from creating sessions",
      targetId: newSession.id,
    });

    try {
      await sendSlackSessionNotification({
        title,
        date,
        startTime,
        endTime,
        creator: session.user.name || session.user.email || userId.toString(),
      });
    } catch (error) {
      console.error("Failed to send Slack notification:", error);
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
        await sendMail(
          "Knowledge sharing session invitation",
          guest,
          emailContent
        );
      }
    }

    return NextResponse.json(
      {
        session: newSession,
        pointsAwarded: PointScale.POINTS_FOR_SESSION,
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
