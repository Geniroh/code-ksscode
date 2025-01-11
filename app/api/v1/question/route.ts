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
    .items(Joi.string())
    .messages({
      "array.base": "Tags must be an array of strings.",
    })
    .optional(),
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
      // 1. Create the question
      const newQuestion = await tx.question.create({
        data: {
          title,
          content,
          author: userId,
        },
      });

      // 2. Handle tags
      if (tags && tags.length > 0) {
        const existingTags = await tx.tags.findMany({
          where: {
            name: { in: tags },
          },
        });

        const existingTagNames = existingTags.map((tag) => tag.name);
        const newTagNames = tags.filter(
          (tag: string) => !existingTagNames.includes(tag)
        );

        const newTagArr = newTagNames.map((name: string) => ({ name }));

        if (newTagArr.length > 0) {
          await tx.tags.createMany({
            data: newTagArr,
          });
        }

        await tx.tags.updateMany({
          where: {
            name: { in: existingTagNames },
          },
          data: {
            questions: { increment: 1 },
          },
        });

        const tagIds = [
          ...existingTags.map((tag) => tag.id),
          ...(newTagNames.length > 0
            ? await tx.tags.findMany({ where: { name: { in: newTagNames } } })
            : []
          ).map((tag) => tag.id),
        ];

        await tx.questionTag.createMany({
          data: tagIds.map((tagId) => ({
            questionId: newQuestion.id,
            tagId,
          })),
        });
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
