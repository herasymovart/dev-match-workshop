import { useParams } from 'react-router-dom';
import { Stub } from './Stub.js';

export function ProjectPage() {
  const { id } = useParams();
  return <Stub title={`Project ${id ?? ''}`} stories={['US-11', 'US-12']} />;
}
