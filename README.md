# TaskFlow

TaskFlow is a production-ready Kanban workspace for organizing work across **Backlog**, **In Progress**, and **Done**. It runs entirely in the browser, keeps a professional dark interface, and stores the board locally so a refresh does not wipe progress.

## Features

- Responsive three-column board with realistic starter tasks
- Create, edit, and delete tasks from accessible dialogs
- Move cards between columns with keyboard-friendly controls
- Low, Medium, and High priority badges
- Optional due dates with overdue and due-soon highlighting on cards
- Text search across titles and descriptions
- Priority and due-date filtering with a one-click reset
- Dashboard statistics for totals, column counts, high-priority work, overdue tasks, and completion rate
- Persistent storage in `localStorage`
- Confirmation before a task is deleted
- Empty states for unused columns and unmatched filters

## Getting started

Requirements: Node.js 20 or later and npm.

```bash
npm install
npm run dev
```

The development server starts at `http://localhost:5173`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run build` | Type-check and create a production build |
| `npm run preview` | Preview the production build locally |

## Architecture

The UI is split into focused modules:

- `src/components` — board, cards, filters, dialogs, and dashboard
- `src/context` — task state, persistence, and board actions
- `src/hooks` — filter state, focus management, and context access
- `src/utils` — filtering, due dates, statistics, reducer logic, and storage
- `src/types` — shared TypeScript contracts
- `src/data` — column definitions and sample tasks

Tasks are stored under the `taskflow.tasks` key. If that key is missing, TaskFlow loads the sample board. An empty saved list is respected, so clearing every card does not restore the demo data.

## Testing

Vitest and React Testing Library cover the important board logic:

- search, priority, and due-date filtering
- dashboard statistics, including overdue work
- due-date parsing, overdue rules, and deadline labels
- reducer actions for create, update, move, and delete
- context persistence against `localStorage`

```bash
npm test
```

## License

This project is released under the MIT License. See [LICENSE](LICENSE).
