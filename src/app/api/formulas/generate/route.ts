import { generateSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";
import { callLLM } from "@/lib/ai";
import client from "prom-client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

const hist = new client.Histogram({
  name: "generate_duration",
  help: "gen time",
});
const cnt = new client.Counter({ name: "generate_requests", help: "count" });

export async function POST(request: Request) {
  // authenticate request
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const end = hist.startTimer();
  cnt.inc();

  try {
    const body = await request.json();
    const parse = generateSchema.safeParse(body);
    if (!parse.success)
      return NextResponse.json({ error: parse.error.message }, { status: 400 });

    const { description } = parse.data;

    // Verify that the user exists in the database
    const userId = session.user.id;
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      // Create the user if it doesn't exist
      await prisma.user.create({
        data: {
          id: userId,
          email: session.user.email || `user-${userId}@example.com`,
          name: session.user.name || "User",
        },
      });
    }

    // Call LLM with simplified approach
    let formulaResponse;
    try {
      formulaResponse = await callLLM(description);
      console.log("Formula response:", formulaResponse);
    } catch (error) {
      console.error("LLM error:", error);
      return NextResponse.json({ error: "LLM error" }, { status: 502 });
    }

    // Create the formula with the simplified structure
    const record = await prisma.formula.create({
      data: {
        userId: userId,
        fragranceFamilyId: formulaResponse.fragranceFamilyId,
        name: formulaResponse.name,
        description: formulaResponse.description,
        topNote: formulaResponse.topNote,
        middleNote: formulaResponse.middleNote,
        baseNote: formulaResponse.baseNote,
        mixing: formulaResponse.mixing,
      },
    });

    end();
    return NextResponse.json(record);
  } catch (error) {
    console.error("Error generating formula:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
