/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import type { Question, Tags } from "@prisma/client";

type QuestionWithTags = Question & {
  tags: Tags[];
};

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const questionTags = await db.questionTag.findMany({
      include: {
        question: true,
        tag: true,
      },
    });

    const groupedQuestions: Record<string, QuestionWithTags> =
      questionTags.reduce((acc, current) => {
        const questionId = current.question.id;

        if (!acc[questionId]) {
          acc[questionId] = {
            ...current.question,
            tags: [],
          };
        }

        acc[questionId].tags.push(current.tag);

        return acc;
      }, {} as Record<string, QuestionWithTags>);

    const result = Object.values(groupedQuestions);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch questions and tags:", error);
    return NextResponse.json(
      { error: "Failed to get questions and tags" },
      { status: 500 }
    );
  }
}
