import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { NotFoundPage } from '../pages/NotFoundPage.js';
import { Stub } from '../pages/Stub.js';

// Component tests for what overview.md "Frontend pages → user stories" promises.

describe('NotFoundPage (US-11 sc.2: unknown project / route)', () => {
  it('shows the message and a link back to the catalog', () => {
    render(
      <MemoryRouter initialEntries={['/nope']}>
        <NotFoundPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Go to catalog' }).getAttribute('href')).toBe('/');
  });
});

describe('Stub page (placeholder until a story is implemented)', () => {
  it('renders the title and the story keys it stands for', () => {
    render(
      <MemoryRouter>
        <Stub title="My applications" stories={['US-13', 'US-14']} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'My applications' })).toBeTruthy();
    expect(screen.getByText(/US-13, US-14/)).toBeTruthy();
  });
});
