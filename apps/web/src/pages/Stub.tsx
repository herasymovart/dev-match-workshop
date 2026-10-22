import type { ReactNode } from 'react';

/** Placeholder used by every page until its story is implemented via /implement-story. */
export function Stub({ title, stories, children }: { title: string; stories: string[]; children?: ReactNode }) {
  return (
    <section>
      <h1>{title}</h1>
      <p className="muted">Stories: {stories.join(', ')} — see docs/architecture/traceability.md</p>
      {children}
    </section>
  );
}
