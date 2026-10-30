import { useReducer } from 'react';
import { Alert, Chip } from '@mui/material';
import ProjectCard from './ProjectCard';
import { availableUnits, hardwareSets, initialState, projectsReducer } from '../model';

export default function Projects() {
  const [state, dispatch] = useReducer(projectsReducer, initialState);
  const joinedCount = state.projects.filter(project => project.joined).length;

  function handleMembership(projectId) {
    dispatch({ type: 'toggleMembership', projectId });
  }

  function handleHardware(projectId, setId, type, quantity) {
    dispatch({ type, projectId, setId, quantity });
  }

  return (
    <div className="app-shell">
      <header className="app-header"><a className="brand" href="https://mintcode1.github.io/"><span className="brand-icon" aria-hidden="true">H</span>Hardware Workspace</a><span className="profile"><span className="avatar" aria-hidden="true">MN</span>Mahin Naveen</span></header>
      <main>
        <div className="page-heading"><div><p className="eyebrow">WORKSPACE / PROJECTS</p><h1>Projects</h1><p>Find your team. Get the hardware you need.</p></div><Chip label={`${joinedCount} joined · ${state.projects.length} projects`} variant="outlined" /></div>
        <section className="inventory" aria-label="Shared hardware inventory">
          <div className="inventory-intro"><span className="status-dot" aria-hidden="true" /><div><strong>Shared inventory</strong><span>Availability across all projects</span></div></div>
          {hardwareSets.map(set => <div key={set.id} className="inventory-set"><span>{set.name}</span><strong>{availableUnits(state.projects, set)} <small>/ {set.capacity} available</small></strong></div>)}
        </section>
        <div className="list-heading"><h2>Your available projects</h2><span>3 authorized projects</span></div>
        <div className="notice" aria-live="polite" aria-atomic="true">{state.notice && <Alert severity={state.notice.severity}>{state.notice.message}</Alert>}</div>
        <div className="project-list">
          {state.projects.map(project => <ProjectCard key={project.id} project={project} hardwareSets={hardwareSets} availability={Object.fromEntries(hardwareSets.map(set => [set.id, availableUnits(state.projects, set)]))} onMembershipChange={handleMembership} onHardwareChange={handleHardware} />)}
        </div>
        <aside className="workspace-note"><strong>A quick note</strong><p>Join a project to manage its hardware. Quantities show each project's checked-out units. Leaving changes your membership; hardware stays with the project. This demo uses sample data and resets when you reload.</p></aside>
      </main>
      <footer><span>EE461L · Hardware management</span><a href="https://github.com/MintCode1/ee461l-hw4-react">View source ↗</a></footer>
    </div>
  );
}
