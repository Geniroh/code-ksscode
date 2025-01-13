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

    const users = await db.user.findMany({
      orderBy: {
        name: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to get users" }, { status: 500 });
  }
}
