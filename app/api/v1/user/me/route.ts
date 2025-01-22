/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const user = await db.user.findFirst({
      where: { id: userId },
      include: {
        _count: {
          select: {
            sessions: true,
            reviews: true,
            points: true,
            answers: true,
            question: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const response = {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      image: user?.image,
      role: user?.role,
      createdAt: user?.createdAt,
      updatedAt: user?.updatedAt,
      meta: {
        sessionsCount: user._count.sessions,
        reviewsCount: user._count.reviews,
        pointsCount: user._count.points,
        questionsCount: user._count.question,
        answersCount: user._count.answers,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Failed to find User", error);
    return NextResponse.json({ error: "Failed to find user" }, { status: 500 });
  }
}
