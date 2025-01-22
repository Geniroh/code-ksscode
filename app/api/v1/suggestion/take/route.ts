import { db } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";
import { auth } from "@/auth";

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

    console.log({ sessionData });

    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

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

    console.log({ sessionResponse });

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
