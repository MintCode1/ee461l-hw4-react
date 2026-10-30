export const hardwareSets = [
  { id: 'hw1', name: 'HWSet1', capacity: 100 },
  { id: 'hw2', name: 'HWSet2', capacity: 100 }
];

export const initialState = {
  projects: [
    { id: 'p1', name: 'Circuit Lab', description: 'Circuit prototyping and measurements', users: ['Alex', 'Sam'], joined: false, hardware: { hw1: 50, hw2: 0 } },
    { id: 'p2', name: 'Sensor Bench', description: 'Sensor integration and data collection', users: ['Jordan', 'Mahin'], joined: true, hardware: { hw1: 0, hw2: 50 } },
    { id: 'p3', name: 'Control Systems', description: 'Control loops and system experiments', users: ['Taylor'], joined: false, hardware: { hw1: 0, hw2: 0 } }
  ],
  notice: null
};

export function availableUnits(projects, set) {
  return set.capacity - projects.reduce((total, project) => total + project.hardware[set.id], 0);
}

export function projectsReducer(state, action) {
  const project = state.projects.find(item => item.id === action.projectId);
  if (!project) return state;

  if (action.type === 'toggleMembership') {
    const joined = !project.joined;
    return {
      projects: state.projects.map(item => item.id === project.id ? {
        ...item,
        joined,
        users: joined ? [...item.users, 'Mahin'] : item.users.filter(user => user !== 'Mahin')
      } : item),
      notice: { severity: 'success', message: `${joined ? 'Joined' : 'Left'} ${project.name}.` }
    };
  }

  if (action.type !== 'checkIn' && action.type !== 'checkOut') return state;
  const set = hardwareSets.find(item => item.id === action.setId);
  if (!set) return state;
  const quantity = Number(action.quantity);
  let error = '';

  if (!project.joined) error = 'Join the project before changing its hardware.';
  else if (!Number.isSafeInteger(quantity) || quantity <= 0) error = 'Enter a positive whole number.';
  else if (action.type === 'checkOut' && quantity > availableUnits(state.projects, set)) error = `Only ${availableUnits(state.projects, set)} units of ${set.name} are available.`;
  else if (action.type === 'checkIn' && quantity > project.hardware[set.id]) error = `${project.name} has only ${project.hardware[set.id]} units of ${set.name} to return.`;

  if (error) return { ...state, notice: { severity: 'error', message: error } };
  const change = action.type === 'checkOut' ? quantity : -quantity;
  return {
    projects: state.projects.map(item => item.id === project.id ? {
      ...item, hardware: { ...item.hardware, [set.id]: item.hardware[set.id] + change }
    } : item),
    notice: { severity: 'success', message: `${action.type === 'checkOut' ? 'Checked out' : 'Checked in'} ${quantity} units of ${set.name} ${action.type === 'checkOut' ? 'for' : 'from'} ${project.name}.` }
  };
}
