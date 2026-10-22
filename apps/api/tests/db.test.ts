import { Prisma } from '@prisma/client';
import { prisma, resetDb } from './helpers/db.js';

// Proves the constraints that docs/architecture/data-model.md promises, against the real test DB.

beforeEach(resetDb);

async function user(email = 'lead@example.com') {
  return prisma.user.create({ data: { email, passwordHash: 'x', displayName: 'Lead' } });
}

describe('data-model.md: User', () => {
  it('email is UNIQUE', async () => {
    await user();
    await expect(user()).rejects.toMatchObject({ code: 'P2002' } satisfies Partial<Prisma.PrismaClientKnownRequestError>);
  });
});

describe('data-model.md: Role', () => {
  it('(projectId, name) is UNIQUE — US-03 sc.3 duplicate role', async () => {
    const owner = await user();
    const project = await prisma.project.create({
      data: { ownerId: owner.id, title: 'Test project', description: 'x'.repeat(30) },
    });
    const role = { projectId: project.id, name: 'QA Engineer', totalSpots: 1, availableSpots: 1 };
    await prisma.role.create({ data: role });
    await expect(prisma.role.create({ data: role })).rejects.toMatchObject({ code: 'P2002' });
  });

  it('defaults: Project.status DRAFT, Role.status OPEN, Application.status PENDING', async () => {
    const owner = await user();
    const project = await prisma.project.create({
      data: { ownerId: owner.id, title: 'Test project', description: 'x'.repeat(30) },
    });
    const role = await prisma.role.create({
      data: { projectId: project.id, name: 'Backend', totalSpots: 2, availableSpots: 2 },
    });
    const app = await prisma.application.create({
      data: { roleId: role.id, applicantId: owner.id, telegram: '@student_dev', githubUrl: 'https://github.com/x' },
    });
    expect([project.status, role.status, app.status]).toEqual(['DRAFT', 'OPEN', 'PENDING']);
  });

  it('deleting a project cascades to its roles and applications', async () => {
    const owner = await user();
    const project = await prisma.project.create({
      data: {
        ownerId: owner.id,
        title: 'Test project',
        description: 'x'.repeat(30),
        roles: { create: { name: 'QA', totalSpots: 1, availableSpots: 1 } },
      },
      include: { roles: true },
    });
    await prisma.application.create({
      data: { roleId: project.roles[0]!.id, applicantId: owner.id, telegram: '@a_b_c_d', githubUrl: 'https://github.com/x' },
    });
    await prisma.project.delete({ where: { id: project.id } });
    expect(await prisma.role.count()).toBe(0);
    expect(await prisma.application.count()).toBe(0);
  });
});
