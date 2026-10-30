# Hardware Workspace

Mahin Naveen · EE461L Homework 4, Task 3

A front-end React app for viewing authorized projects, joining or leaving a project, and checking shared hardware in and out. It uses sample data; reloading restores the starting state.

## Run locally

Install Node.js 22 or 24, then run:

```sh
npm ci
npm start
```

Open http://localhost:3000. Run `npm test -- --runInBand` for the state tests and `npm run build` for the production bundle. The app uses the Create React App toolchain (`react-scripts`).

Live demo: https://mintcode1.github.io/ee461l-hw4-react/

## Component structure

```text
App
└── Projects
    └── ProjectCard (reused for each project)
        └── HardwareRow (reused for each hardware set)
```

- **Library components:** Material UI `Button`, `TextField`, `Card`, `Chip`, and `Alert`.
- **Custom components:** `Projects`, `ProjectCard`, and `HardwareRow`.
- **Props:** `Projects` passes project data and event handlers to `ProjectCard`; `ProjectCard` passes a hardware set, allocation, membership, and an event handler to `HardwareRow`.
- **State:** `Projects` owns membership and allocations with `useReducer`. `HardwareRow` uses `useState` for quantity input. Click handlers dispatch updates.

## Behavior

Both hardware sets have a capacity of 100. Availability is shared across all projects, so a checkout immediately updates every row showing the same set. Invalid quantities, checkouts above available stock, and check-ins above a project's allocation are rejected. Joining enables that project's controls. Leaving changes membership and preserves the project's allocation, since hardware belongs to the project.

The project has no backend or authentication. Names and project descriptions are demo data. The production build is copied into `docs/` for GitHub Pages, using `main` and `/docs` as the publishing source. To update that demo, rebuild and replace `docs/` with the contents of `build/`, including an empty `.nojekyll` file.

## Canvas

Submit the React source ZIP without `node_modules`, `build`, or `docs`. Include `src`, `public`, `package.json`, and `package-lock.json`. The personal site's repository URL is a separate Task 1 deliverable.
