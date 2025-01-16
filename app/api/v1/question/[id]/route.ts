import { db } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const question = await db.question.findUnique({
      where: { id },
      include: {
        user: true,
        answer: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    const questionTags = await db.questionTag.findMany({
      where: { questionId: id },
      include: {
        tag: true,
      },
    });

    const tags = questionTags.map((questionTag) => questionTag.tag);

    const updatedQuestion = { ...question, tags };

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json(
      { error: "Failed to fetch question" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Authenticate user
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Parse the incoming JSON body
    const body = await req.json();
    const { title, content, tags } = body;

    if (!title && !content && !tags) {
      return NextResponse.json(
        { error: "No fields to update provided" },
        { status: 400 }
      );
    }

    // Check if the question exists
    const question = await db.question.findUnique({
      where: { id },
      include: {
        user: true,
        questions: true, // For tags
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Verify if the user is the author of the question
    if (question.author !== session.user.id) {
      return NextResponse.json(
        { error: "You are not authorized to edit this question" },
        { status: 403 }
      );
    }

    // Update the question fields
    const updatedQuestion = await db.question.update({
      where: { id },
      data: {
        title: title || undefined,
        content: content || undefined,
        updatedAt: new Date(),
      },
    });

    console.log(updatedQuestion);

    // Handle tag updates if provided
    if (tags && Array.isArray(tags)) {
      // Delete existing tags for the question
      await db.questionTag.deleteMany({
        where: { questionId: id },
      });

      // Create new tag associations
      const tagPromises = tags.map((tag: string) =>
        db.questionTag.create({
          data: {
            questionId: id,
            tagId: tag,
          },
        })
      );
      await Promise.all(tagPromises);
    }

    return NextResponse.json({ message: "Question updated successfully" });
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }
}
