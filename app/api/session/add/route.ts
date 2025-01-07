import { db } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";
import { auth } from "@/auth";

// GET all sessions
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      include: {
        user: {
          select: { name: true, email: true },
        },
        resources: true,
        reviews: true,
      },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to get sessions" },
      { status: 500 }
    );
  }
}

const postSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
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

// Create a new session
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { error, value } = postSchema.validate(body);

    if (error) {
      return NextResponse.json(
        { error: error.details[0].message },
        { status: 400 }
      );
    }

    const { title, description, startDate, endDate, resources, guests, image } =
      value;

    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const newSession = await db.session.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId,
        guests,
        image,
        resources: {
          create: resources,
        },
      },
    });

    return NextResponse.json(newSession, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create a session" },
      { status: 500 }
    );
  }
}
