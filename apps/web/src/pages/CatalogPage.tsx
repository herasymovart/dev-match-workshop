import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client.js';
import { Stub } from './Stub.js';

export function CatalogPage() {
  // Smoke check that web → api wiring works; replaced by GET /projects in US-09.
  const health = useQuery({ queryKey: ['health'], queryFn: () => api.get<{ ok: boolean }>('/health') });

  return (
    <Stub title="Project catalog" stories={['US-09', 'US-10']}>
      <p className="muted">API: {health.isPending ? '…' : health.isError ? 'unavailable' : health.data.ok ? 'ok' : '?'}</p>
    </Stub>
  );
}
