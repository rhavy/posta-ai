import { PrismaClient } from '../generated/prisma/client';

// lib/prisma.ts (reutilizável em todo o projeto)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
