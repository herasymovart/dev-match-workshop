import { prisma } from '../../src/lib/prisma.js';

/** Deletes every row in FK order. Call in beforeEach so tests never share data. */
export async function resetDb() {
  await prisma.application.deleteMany();
  await prisma.role.deleteMany();
  await prisma.projectTag.deleteMany();
  await prisma.project.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
}

export { prisma };
