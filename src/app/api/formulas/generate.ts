import type { NextApiRequest, NextApiResponse } from "next";
import { generateSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";
import { callLLM } from "@/lib/ai";
import client from "prom-client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const hist = new client.Histogram({
  name: "generate_duration",
  help: "gen time",
});
const cnt = new client.Counter({ name: "generate_requests", help: "count" });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // authenticate request
  const session = await getServerSession({ req, res, ...authOptions });
  if (!session?.user) return res.status(401).json({ error: "Unauthorized" });

  const end = hist.startTimer();
  cnt.inc();

  if (req.method !== "POST") return res.status(405).end();
  const parse = generateSchema.safeParse(req.body);
  if (!parse.success)
    return res.status(400).json({ error: parse.error.message });

  const { description } = parse.data;
  // call LLM
  let formula;
  try {
    formula = await callLLM(description);
  } catch (error) {
    console.error(error);
    return res.status(502).json({ error: "LLM error" });
  }

  // persist with user relation
  const record = await prisma.formula.create({
    data: {
      description,
      components: { create: formula.components },
      userId: session.user.id,
    },
    include: { components: true },
  });

  end();
  res.status(200).json(record);
}
