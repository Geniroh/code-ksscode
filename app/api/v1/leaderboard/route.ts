import { db } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

type FilterOptions = {
  type?: string;
  startDate?: Date;
  endDate?: Date;
  page: number;
  limit: number;
};

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const filters: FilterOptions = {
      type: searchParams.get("type") || undefined,
      startDate: searchParams.get("startDate")
        ? new Date(searchParams.get("startDate")!)
        : undefined,
      endDate: searchParams.get("endDate")
        ? new Date(searchParams.get("endDate")!)
        : undefined,
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : 15,
    };

    // Calculate skip value for pagination
    const skip = (filters.page - 1) * filters.limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dateFilter: any = {};
    if (filters.startDate || filters.endDate) {
      dateFilter["createdAt"] = {
        ...(filters.startDate && { gte: filters.startDate }),
        ...(filters.endDate && { lte: filters.endDate }),
      };
    }

    // Get total number of users for pagination
    const totalUsers = await db.user.count();

    // Fetch users with their points and related data
    const users = await db.user.findMany({
      skip,
      take: filters.limit,
      include: {
        points: {
          where: {
            ...dateFilter,
            ...(filters.type && { type: filters.type }),
          },
        },
        sessions: {
          where: dateFilter,
        },
        answers: {
          where: dateFilter,
        },
        question: {
          where: dateFilter,
        },
        activityLog: {
          where: dateFilter,
          orderBy: {
            createdAt: "desc",
          },
          take: 5, // Get last 5 activities
        },
      },
    });

    // Process and format the leaderboard data
    const leaderboard = users.map((user) => {
      const totalPoints = user.points.reduce(
        (sum, point) => sum + point.value,
        0
      );

      // Calculate point statistics
      const pointStats = user.points.reduce((stats, point) => {
        stats[point.type] = (stats[point.type] || 0) + point.value;
        return stats;
      }, {} as Record<string, number>);

      // Calculate engagement metrics
      const engagementScore =
        (user.sessions.length * 2 +
          user.answers.length * 1.5 +
          user.question.length) /
        100;

      return {
        id: user.id,
        name: user.name || "Anonymous",
        email: user.email,
        image: user.image,
        metrics: {
          totalPoints,
          pointsByType: pointStats,
          sessionsCreated: user.sessions.length,
          answersGiven: user.answers.length,
          questionsAsked: user.question.length,
          engagementScore: Number(engagementScore.toFixed(2)),
          averagePointsPerSession:
            user.sessions.length > 0
              ? Number((totalPoints / user.sessions.length).toFixed(2))
              : 0,
        },
        recentActivity: user.activityLog.map((log) => ({
          action: log.action,
          date: log.createdAt,
          metadata: log.metadata,
        })),
        joinedAt: user.createdAt,
      };
    });

    // Sort by total points and add ranks
    const sortedLeaderboard = leaderboard
      .sort((a, b) => b.metrics.totalPoints - a.metrics.totalPoints)
      .map((user, index) => ({
        rank: skip + index + 1,
        ...user,
      }));

    // Calculate leaderboard statistics
    const leaderboardStats = {
      totalParticipants: totalUsers,
      averagePoints: Number(
        (
          leaderboard.reduce((sum, user) => sum + user.metrics.totalPoints, 0) /
          leaderboard.length
        ).toFixed(2)
      ),
      topScore: Math.max(
        ...leaderboard.map((user) => user.metrics.totalPoints)
      ),
      totalPages: Math.ceil(totalUsers / (filters.limit || 0)),
    };

    return NextResponse.json({
      leaderboard: sortedLeaderboard,
      metadata: {
        currentPage: filters.page,
        totalPages: leaderboardStats.totalPages,
        pageSize: filters.limit,
        totalUsers: totalUsers,
        filters: {
          type: filters.type || "all",
          dateRange: {
            start: filters.startDate,
            end: filters.endDate,
          },
        },
        stats: leaderboardStats,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
