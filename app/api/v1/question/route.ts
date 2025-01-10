/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import Joi from "joi";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const questions = await db.question.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get questions" },
      { status: 500 }
    );
  }
}

const questionSchema = Joi.object({
  title: Joi.string().min(5).max(255).required().messages({
    "string.base": "Title should be a string.",
    "string.empty": "Title cannot be empty.",
    "string.min": "Title must be at least 5 characters long.",
    "string.max": "Title cannot exceed 255 characters.",
    "any.required": "Title is required.",
  }),
  content: Joi.string().min(10).required().messages({
    "string.base": "Content should be a string.",
    "string.empty": "Content cannot be empty.",
    "string.min": "Content must be at least 10 characters long.",
    "any.required": "Content is required.",
  }),
  tags: Joi.array()
    .items(Joi.string()) // Assuming MongoDB ObjectId for tags
    .messages({
      "array.base": "Tags must be an array of strings.",
      // "string.pattern.base": "Each tag must be a valid ObjectId.",
    }),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const body = await req.json();
    const { error, value } = questionSchema.validate(body);

    if (error) {
      return NextResponse.json(
        { error: error.details.map((detail) => detail.message).join(", ") },
        { status: 400 }
      );
    }

    const { title, content, tags } = value;

    const question = await db.$transaction(async (tx) => {
      const newQuestion = await tx.question.create({
        data: {
          title,
          content,
          author: userId,
        },
      });

      if (tags && tags.length > 0) {
        const questionTags = tags.map((tagId: string) => ({
          questionId: newQuestion.id,
          tagId,
        }));

        await tx.questionTag.createMany({ data: questionTags });
      }

      return newQuestion;
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}
