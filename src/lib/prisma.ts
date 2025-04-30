import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __globalPrisma: PrismaClient;
}

// Determine if we're running in Docker by checking for specific environment variables
// Docker sets the HOSTNAME environment variable automatically
const isRunningInDocker = !!process.env.HOSTNAME;

// Create the Prisma client with the appropriate database URL
export const prisma =
  global.__globalPrisma ||
  new PrismaClient({
    log: ["query"],
    datasources: isRunningInDocker
      ? {
          db: {
            url: "postgresql://postgres:postgres@db:5432/fragrances",
          },
        }
      : undefined, // Use the DATABASE_URL from .env when not in Docker
  });

if (process.env.NODE_ENV !== "production") {
  global.__globalPrisma = prisma;
}
