import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __globalPrisma: PrismaClient;
}

export const prisma =
  global.__globalPrisma || new PrismaClient({ log: ["query"] });

if (process.env.NODE_ENV !== "production") {
  global.__globalPrisma = prisma;
}
