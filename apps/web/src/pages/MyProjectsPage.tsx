import { Link } from 'react-router-dom';
import { Stub } from './Stub.js';

export function MyProjectsPage() {
  return (
    <Stub title="My projects" stories={['navigation']}>
      <Link to="/my/projects/new">Create project</Link>
    </Stub>
  );
}
