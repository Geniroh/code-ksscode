/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await db.session.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(sessions);
  } catch (error) {
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

    return NextResponse.json(newSession, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create a session" },
      { status: 500 }
    );
  }
}
