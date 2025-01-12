import { db } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";
import { auth } from "@/auth";

const postSchema = Joi.object({
  content: Joi.string().required(),
  questionId: Joi.string().required(),
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

    const { content, questionId } = value;

    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const newAnswer = await db.answers.create({
      data: {
        content,
        questionId,
        userId,
        downvotes: 0,
      },
    });

    if (newAnswer) {
      await db.question.update({
        where: {
          id: questionId,
        },
        data: {
          answers: {
            increment: 1,
          },
        },
      });
    }

    return NextResponse.json(newAnswer, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create a session" },
      { status: 500 }
    );
  }
}
