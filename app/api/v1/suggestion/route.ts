/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";
import { auth } from "@/auth";
import { sendMail } from "@/actions/mail";
import { awardPoints } from "@/actions/points";
import { PointScale } from "@/constant/pointscale";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const suggestions = await db.suggestions.findMany({
      where: {
        taken: false,
      },
    });

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json(
      { error: "Failed to get suggestions" },
      { status: 500 }
    );
  }
}

const postSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional().allow(null),
  suggestedUsers: Joi.array().items(Joi.string().email()).optional(),
  tags: Joi.array()
    .items(Joi.string())
    .messages({
      "array.base": "Tags must be an array of strings.",
    })
    .optional(),
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

    const { title, description, suggestedUsers, tags } = value;

    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const newSuggestion = await db.suggestions.create({
      data: {
        title,
        description,
        suggestedUsers: suggestedUsers || [],
        tags: tags || [],
      },
    });

    await awardPoints({
      userId: userId.toString(),
      points: PointScale.POINTS_FOR_SUGGESTION,
      type: "SUGGESTION_POINTS",
      reason: "Points from making a suggestion",
      targetId: newSuggestion.id,
    });

    // Send email notifications
    if (suggestedUsers && suggestedUsers.length > 0) {
      for (const guest of suggestedUsers) {
        const emailContent = `
          <h1>${session?.user?.name} suggested you for a KSS</h1>
          <p>Title: ${title}</p>
          <p>Description: ${description}</p>
        `;
        await sendMail(
          `${session?.user?.name} suggested you for a KSS!`,
          guest,
          emailContent
        );
      }
    }

    return NextResponse.json(newSuggestion, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create a suggestion" },
      { status: 500 }
    );
  }
}
