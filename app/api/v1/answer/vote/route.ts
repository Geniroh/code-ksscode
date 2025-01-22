import { db } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import Joi from "joi";

const postSchema = Joi.object({
  answerId: Joi.string().required(),
  action: Joi.string().valid("upvote", "downvote").required(),
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

    const { answerId, action } = value;

    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const answer = await db.answers.findUnique({
      where: { id: answerId },
    });

    if (!answer) {
      return NextResponse.json({ error: "Answer not found." }, { status: 404 });
    }

    const existingVote = await db.vote.findUnique({
      where: {
        userId_answerId: {
          userId,
          answerId,
        },
      },
    });

    if (existingVote) {
      if (existingVote.type === action) {
        return NextResponse.json(
          { error: `You have already ${action}d this answer.` },
          { status: 403 }
        );
      }

      // User is changing their vote
      await db.vote.update({
        where: {
          id: existingVote.id,
        },
        data: {
          type: action,
        },
      });

      // Adjust the upvotes and downvotes
      const updatedAnswer = await db.answers.update({
        where: { id: answerId },
        data: {
          upvotes:
            action === "upvote" ? answer.upvotes + 1 : answer.upvotes - 1, // Decrease if switching to downvote
          downvotes:
            action === "downvote" ? answer.downvotes + 1 : answer.downvotes - 1, // Decrease if switching to upvote
        },
      });

      return NextResponse.json(
        {
          message: `Your vote has been updated to ${action}.`,
          answer: updatedAnswer,
        },
        { status: 200 }
      );
    }

    // If no existing vote, create a new one
    await db.vote.create({
      data: {
        userId,
        answerId,
        type: action,
      },
    });

    // Update the upvotes or downvotes field on the answer
    const updatedAnswer = await db.answers.update({
      where: { id: answerId },
      data: {
        upvotes: action === "upvote" ? answer.upvotes + 1 : answer.upvotes,
        downvotes:
          action === "downvote" ? answer.downvotes + 1 : answer.downvotes,
      },
    });

    return NextResponse.json(
      { message: `Answer successfully ${action}d.`, answer: updatedAnswer },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing vote:", error);
    return NextResponse.json(
      { error: "Failed to process vote." },
      { status: 500 }
    );
  }
}
