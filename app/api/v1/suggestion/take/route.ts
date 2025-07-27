import { db } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";
import { auth } from "@/auth";
import { sendSlackSessionNotification } from "@/actions/slack";
import { sendMail } from "@/actions/mail";
import { awardPoints } from "@/actions/points";
import { PointScale } from "@/constant/pointscale";

const postSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional().allow(null),
  date: Joi.date().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  suggestionId: Joi.string().required(),
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

    const { suggestionId, ...sessionData } = value;

    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const sessionResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}session`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData),
      }
    );

    if (!sessionResponse.ok) {
      const errorData = await sessionResponse.json();
      return NextResponse.json(
        { message: "Failed to create session", error: errorData },
        { status: 500 }
      );
    }

    try {
      await sendSlackSessionNotification({
        title: sessionData?.title,
        date: sessionData?.date,
        startTime: sessionData?.startTime,
        endTime: sessionData?.endTime,
        creator: session.user.name || session.user.email || userId.toString(),
      });
    } catch (error) {
      console.error("Failed to send Slack notification:", error);
    }

    // Send email notifications
    if (sessionData?.guests && sessionData?.guests.length > 0) {
      for (const guest of sessionData?.guests) {
        const emailContent = `
          <h1>You are invited to a session</h1>
          <p>Title: ${sessionData?.title}</p>
          <p>Date: ${sessionData?.date}</p>
          <p>Start Time: ${sessionData?.startTime}</p>
          <p>End Time: ${sessionData?.endTime}</p>
          <p>Description: ${sessionData?.description}</p>
        `;
        await sendMail(
          "Knowledge sharing session invitation",
          guest,
          emailContent
        );
      }
    }

    await awardPoints({
      userId: userId.toString(),
      points: PointScale.POINTS_FOR_TAKING_SUGGESTION,
      type: "SUGGESTION_TAKEN_POINTS",
      reason: "Points for taking a suggestion",
      targetId: suggestionId,
    });

    await db.suggestions.update({
      where: { id: suggestionId },
      data: { taken: true },
    });

    return NextResponse.json(
      {
        sessionResponse,
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
