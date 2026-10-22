import { PrismaClient } from '@prisma/client';

// Single client per process. Services import this; routes never touch Prisma directly.
export const prisma = new PrismaClient();
