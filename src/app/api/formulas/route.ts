import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to view formulas" },
        { status: 401 }
      );
    }

    const formulas = await prisma.formula.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        fragranceFamily: true,
      },
    });

    return NextResponse.json(formulas);
  } catch (error) {
    console.error("Error fetching formulas:", error);
    return NextResponse.json(
      { error: "Failed to fetch formulas" },
      { status: 500 }
    );
  }
}
