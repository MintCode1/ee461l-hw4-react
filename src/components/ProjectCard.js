import { Button, Card, Chip } from '@mui/material';
import HardwareRow from './HardwareRow';

export default function ProjectCard({ project, hardwareSets, availability, onMembershipChange, onHardwareChange }) {
  return (
    <Card component="section" variant="outlined" className={`project-card ${project.joined ? 'joined' : ''}`} aria-label={project.name}>
      <div className="project-details"><div className="project-title"><h3>{project.name}</h3>{project.joined && <Chip label="Joined" size="small" color="primary" variant="outlined" />}</div><p>{project.description}</p><div className="project-users"><span>Authorized users</span><strong>{project.users.join(', ')}</strong></div></div>
      <div className="hardware-list">{hardwareSets.map(set => <HardwareRow key={set.id} projectName={project.name} hardwareSet={set} checkedOut={project.hardware[set.id]} available={availability[set.id]} joined={project.joined} onHardwareChange={(type, quantity) => onHardwareChange(project.id, set.id, type, quantity)} />)}</div>
      <div className="membership"><Button variant={project.joined ? 'outlined' : 'contained'} onClick={() => onMembershipChange(project.id)} aria-label={`${project.joined ? 'Leave' : 'Join'} ${project.name}`}>{project.joined ? 'Leave' : 'Join'}</Button></div>
    </Card>
  );
}
