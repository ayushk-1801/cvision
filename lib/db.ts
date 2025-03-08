import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Use a single Prisma Client instance across the app
export const db = global.prisma || new PrismaClient();

// In development, prevent multiple instances during hot-reloads
if (process.env.NODE_ENV !== 'production') {
  global.prisma = db;
}
