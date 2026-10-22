import { z } from 'zod';

// Statuses are stored as strings in SQLite (ADR-0005); these enums are the only allowed values.
// Transitions are documented in docs/architecture/domain-model.md.

export const ProjectStatus = z.enum(['DRAFT', 'PUBLISHED', 'CLOSED']);
export type ProjectStatus = z.infer<typeof ProjectStatus>;

export const RoleStatus = z.enum(['OPEN', 'FILLED']);
export type RoleStatus = z.infer<typeof RoleStatus>;

export const ApplicationStatus = z.enum(['PENDING', 'APPROVED', 'REJECTED']);
export type ApplicationStatus = z.infer<typeof ApplicationStatus>;
