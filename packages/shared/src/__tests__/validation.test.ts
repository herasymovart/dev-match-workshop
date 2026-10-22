import { describe, expect, it } from 'vitest';
import {
  MESSAGES,
  addRoleSchema,
  createApplicationSchema,
  createProjectSchema,
  githubUrlSchema,
  normalizeTag,
  telegramSchema,
} from '../validation.js';

const firstMessage = (r: { success: boolean; error?: { issues: { message: string }[] } }) =>
  r.success ? undefined : r.error?.issues[0]?.message;

describe('US-01 Telegram contact', () => {
  it('sc.1 happy path: "@orest_lead" is stored as "@orest_lead"', () => {
    expect(telegramSchema.parse('@orest_lead')).toBe('@orest_lead');
  });

  it('sc.1 normalization: "orest_lead" without "@" becomes "@orest_lead"', () => {
    expect(telegramSchema.parse('orest_lead')).toBe('@orest_lead');
    expect(telegramSchema.parse('  orest_lead ')).toBe('@orest_lead');
  });

  it('sc.2 empty contact is rejected with the AC message', () => {
    expect(firstMessage(telegramSchema.safeParse(''))).toBe(MESSAGES.telegramRequired);
    expect(firstMessage(telegramSchema.safeParse('   '))).toBe(MESSAGES.telegramRequired);
  });

  it('sc.3 "orest lead!" (forbidden chars) and "abc" (< 5 chars) are rejected', () => {
    expect(firstMessage(telegramSchema.safeParse('orest lead!'))).toBe(MESSAGES.telegramFormat);
    expect(firstMessage(telegramSchema.safeParse('abc'))).toBe(MESSAGES.telegramFormat);
    expect(firstMessage(telegramSchema.safeParse('a'.repeat(33)))).toBe(MESSAGES.telegramFormat);
  });
});

describe('US-02 Project card', () => {
  const valid = {
    title: 'DevMatch — a team-finding platform',
    description: 'A service that simplifies assembling student teams for hackathons and coursework.',
    tags: ['Java', 'Spring Boot', 'React', 'PostgreSQL'],
  };

  it('sc.1 happy path: valid card passes', () => {
    expect(createProjectSchema.safeParse(valid).success).toBe(true);
  });

  it('sc.2 description shorter than 30 chars is rejected with the AC message', () => {
    const r = createProjectSchema.safeParse({ ...valid, description: 'Cool project' });
    expect(firstMessage(r)).toBe(MESSAGES.projectDescription);
  });

  it('AC: title must be 5–100 chars, tags 1–10', () => {
    expect(firstMessage(createProjectSchema.safeParse({ ...valid, title: 'Dev' }))).toBe(MESSAGES.projectTitle);
    expect(firstMessage(createProjectSchema.safeParse({ ...valid, tags: [] }))).toBe(MESSAGES.projectTags);
    expect(firstMessage(createProjectSchema.safeParse({ ...valid, tags: Array(11).fill('x') }))).toBe(MESSAGES.projectTags);
  });
});

describe('US-03 Open role', () => {
  it('sc.1 happy path: "Frontend Developer" with 1 spot', () => {
    expect(addRoleSchema.parse({ name: 'Frontend Developer', totalSpots: 1 })).toEqual({
      name: 'Frontend Developer',
      totalSpots: 1,
    });
  });

  it('sc.2 spots 0, -2 and 1.5 are rejected with the AC message', () => {
    for (const totalSpots of [0, -2, 1.5, 6]) {
      expect(firstMessage(addRoleSchema.safeParse({ name: 'QA', totalSpots }))).toBe(MESSAGES.roleSpots);
    }
  });
});

describe('US-10 Tag filter', () => {
  it('AC: tag lookup is case-insensitive via normalization', () => {
    expect(normalizeTag('Java')).toBe(normalizeTag('JAVA'));
    expect(normalizeTag('  Spring   Boot ')).toBe('spring boot');
  });
});

describe('US-12 Application form', () => {
  it('sc.1 happy path: telegram, github and comment', () => {
    const r = createApplicationSchema.parse({
      telegram: '@student_dev',
      githubUrl: 'https://github.com/student-dev',
      comment: 'I have experience building UI with React',
    });
    expect(r.telegram).toBe('@student_dev');
    expect(r.githubUrl).toBe('https://github.com/student-dev');
  });

  it('sc.2 "https://gitlab.com/profile" and "my-repo" are rejected with the AC message', () => {
    expect(firstMessage(githubUrlSchema.safeParse('https://gitlab.com/profile'))).toBe(MESSAGES.githubUrl);
    expect(firstMessage(githubUrlSchema.safeParse('my-repo'))).toBe(MESSAGES.githubUrl);
    expect(firstMessage(githubUrlSchema.safeParse('http://github.com/x'))).toBe(MESSAGES.githubUrl);
    expect(firstMessage(githubUrlSchema.safeParse('https://github.com/'))).toBe(MESSAGES.githubUrl);
  });

  it('AC: empty telegram means "use profile contact"; comment over 300 chars is rejected', () => {
    const r = createApplicationSchema.parse({ telegram: '', githubUrl: 'https://github.com/x' });
    expect(r.telegram).toBeUndefined();
    const long = createApplicationSchema.safeParse({ githubUrl: 'https://github.com/x', comment: 'a'.repeat(301) });
    expect(firstMessage(long)).toBe(MESSAGES.comment);
  });
});
