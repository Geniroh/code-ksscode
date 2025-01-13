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
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Failed to find User", error);
    return NextResponse.json({ error: "Failed to find user" }, { status: 500 });
  }
}
