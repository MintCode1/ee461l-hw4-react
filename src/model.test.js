import { availableUnits, hardwareSets, initialState, projectsReducer } from './model';

const change = (state, type, quantity, projectId = 'p2', setId = 'hw1') => projectsReducer(state, { type, quantity, projectId, setId });

test('inventory includes allocations from projects the user has not joined', () => {
  expect(availableUnits(initialState.projects, hardwareSets[0])).toBe(50);
  expect(availableUnits(initialState.projects, hardwareSets[1])).toBe(50);
});

test('joining and leaving updates membership without losing project hardware', () => {
  const joined = change(initialState, 'toggleMembership', undefined, 'p1');
  expect(joined.projects[0].joined).toBe(true);
  expect(joined.projects[0].users).toContain('Mahin');
  const left = change(joined, 'toggleMembership', undefined, 'p1');
  expect(left.projects[0].joined).toBe(false);
  expect(left.projects[0].users).not.toContain('Mahin');
  expect(left.projects[0].hardware.hw1).toBe(50);
});

test('hardware can be checked out and returned, with shared inventory kept in sync', () => {
  const checkedOut = change(initialState, 'checkOut', '10');
  expect(checkedOut.projects[1].hardware.hw1).toBe(10);
  expect(availableUnits(checkedOut.projects, hardwareSets[0])).toBe(40);
  const checkedIn = change(checkedOut, 'checkIn', '10');
  expect(checkedIn.projects[1].hardware.hw1).toBe(0);
  expect(availableUnits(checkedIn.projects, hardwareSets[0])).toBe(50);
});

test('exactly the available stock can be checked out', () => {
  const state = change(initialState, 'checkOut', '50');
  expect(availableUnits(state.projects, hardwareSets[0])).toBe(0);
  expect(state.notice.severity).toBe('success');
});

test.each(['0', '-1', '1.5', '', 'abc', '9007199254740992'])('rejects invalid quantity %p without changing allocations', quantity => {
  const state = change(initialState, 'checkOut', quantity);
  expect(state.projects).toEqual(initialState.projects);
  expect(state.notice.severity).toBe('error');
});

test('rejects checking out more than the shared supply', () => {
  const state = change(initialState, 'checkOut', '51');
  expect(state.projects).toEqual(initialState.projects);
  expect(state.notice.message).toContain('Only 50');
});

test('rejects returning more than the project has checked out', () => {
  const state = change(initialState, 'checkIn', '51', 'p2', 'hw2');
  expect(state.projects).toEqual(initialState.projects);
  expect(state.notice.severity).toBe('error');
});

test('membership is required for hardware changes', () => {
  const state = change(initialState, 'checkOut', '1', 'p1');
  expect(state.projects).toEqual(initialState.projects);
  expect(state.notice.message).toContain('Join the project');
});

test('hardware updates do not mutate the initial state', () => {
  const state = change(initialState, 'checkOut', '8');
  expect(initialState.projects[1].hardware.hw1).toBe(0);
  expect(state.projects[1].hardware.hw1).toBe(8);
});
