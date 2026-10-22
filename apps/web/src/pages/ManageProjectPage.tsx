import { useParams } from 'react-router-dom';
import { Stub } from './Stub.js';

export function ManageProjectPage() {
  const { id } = useParams();
  return (
    <Stub title={`Manage project ${id ?? ''}`} stories={['US-03', 'US-04', 'US-08', 'US-05', 'US-06', 'US-07']}>
      <p className="muted">Tabs: "Roles" (US-03, US-04, US-08) · "Applications" (US-05, US-06, US-07)</p>
    </Stub>
  );
}
