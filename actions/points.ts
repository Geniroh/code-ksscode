"use server";

import { db } from "@/prisma";

type PointsType =
  | "SESSION_POINTS"
  | "QUESTION_POINTS"
  | "ANSWER_POINTS"
  | "SUGGESTION_POINTS";

interface AwardPointsParams {
  userId: string;
  points: number;
  type: PointsType;
  reason: string;
  targetId?: string;
}

export async function awardPoints({
  userId,
  points,
  type,
  reason,
  targetId,
}: AwardPointsParams) {
  return await db.$transaction(async (tx) => {
    // Find existing points record or create new one
    const existingPoints = await tx.points.findFirst({
      where: {
        userId,
        type,
      },
    });

    let updatedPoints;
    if (existingPoints) {
      // Update existing points record
      updatedPoints = await tx.points.update({
        where: { id: existingPoints.id },
        data: {
          value: existingPoints.value + points,
        },
      });
    } else {
      // Create new points record
      updatedPoints = await tx.points.create({
        data: {
          userId,
          type,
          value: points,
          reason,
        },
      });
    }

    // Create activity log entry for points
    await tx.activityLog.create({
      data: {
        userId,
        action: "POINTS_EARNED",
        targetId,
        metadata: {
          points,
          reason,
          newTotal: updatedPoints.value,
        },
      },
    });

    return updatedPoints;
  });
}
