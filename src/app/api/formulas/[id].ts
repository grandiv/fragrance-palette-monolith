import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const formula = await prisma.formula.findUnique({
    where: { id: String(id) },
    include: { components: true, feedback: true },
  });
  if (!formula) return res.status(404).json({ error: "Not found" });
  res.status(200).json(formula);
}
