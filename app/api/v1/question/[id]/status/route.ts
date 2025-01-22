import { db } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import Joi from "joi";

const patchSchema = Joi.object({
  answered: Joi.boolean().required(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { error, value } = patchSchema.validate(body);
    if (error) {
      return NextResponse.json(
        { message: error.details[0].message },
        { status: 400 }
      );
    }

    const { answered } = value;

    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the question by ID
    const question = await db.question.findUnique({
      where: { id },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found." },
        { status: 404 }
      );
    }

    // Toggle the `answered` property
    const updatedQuestion = await db.question.update({
      where: { id },
      data: { answered: !answered },
    });

    return NextResponse.json(
      {
        message: `Question marked as ${
          updatedQuestion.answered ? "answered" : "unanswered"
        }.`,
        question: updatedQuestion,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error toggling question status:", error);
    return NextResponse.json(
      { error: "Failed to toggle question status." },
      { status: 500 }
    );
  }
}
