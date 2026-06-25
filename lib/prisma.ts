import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `globalThis` object to prevent
// exhausting database connections during hot reloads in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
