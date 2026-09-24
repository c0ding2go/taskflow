import type { Task } from "../types/task";
import { addDays, toISODate, todayDate } from "../utils/dueDate";

/** Returns the ISO date string `days` days from today. */
function dueIn(days: number): string {
  return toISODate(addDays(todayDate(), days));
}

export const SAMPLE_TASKS: Task[] = [
  {
    id: "task-onboarding-copy",
    title: "Audit onboarding copy",
    description:
      "Review the first-run screens and tighten language so new users understand how to create and move tasks.",
    status: "backlog",
    priority: "medium",
    dueDate: dueIn(-3),
  },
  {
    id: "task-search-empty-state",
    title: "Design empty states for filtered results",
    description:
      "Add a clear message and recovery action when search or priority filters hide every card.",
    status: "backlog",
    priority: "low",
  },
  {
    id: "task-a11y-dialogs",
    title: "Review dialog accessibility",
    description:
      "Confirm create, edit, and delete dialogs expose labels, descriptions, and keyboard focus correctly.",
    status: "backlog",
    priority: "high",
    dueDate: dueIn(0),
  },
  {
    id: "task-keyboard-docs",
    title: "Document keyboard shortcuts",
    description:
      "List supported shortcuts for opening the composer, moving cards, and closing dialogs.",
    status: "backlog",
    priority: "low",
  },
  {
    id: "task-persistence",
    title: "Implement local task persistence",
    description:
      "Store the board in localStorage so the workspace survives a refresh without a backend.",
    status: "in-progress",
    priority: "high",
    dueDate: dueIn(1),
  },
  {
    id: "task-filter-tests",
    title: "Cover filter logic with tests",
    description:
      "Add unit tests for text search, priority filters, and combined matching rules.",
    status: "in-progress",
    priority: "high",
    dueDate: dueIn(5),
  },
  {
    id: "task-column-layout",
    title: "Refine board column layout",
    description:
      "Keep columns readable on wide screens and preserve a horizontal board on smaller viewports.",
    status: "in-progress",
    priority: "medium",
    dueDate: dueIn(14),
  },
  {
    id: "task-dashboard-stats",
    title: "Ship dashboard statistics",
    description:
      "Surface totals, column counts, high-priority work, and completion rate above the board.",
    status: "done",
    priority: "medium",
    dueDate: dueIn(-10),
  },
  {
    id: "task-card-typography",
    title: "Polish task card typography",
    description:
      "Balance title weight, description contrast, and badge spacing so cards scan quickly.",
    status: "done",
    priority: "low",
  },
  {
    id: "task-mobile-overflow",
    title: "Fix overflow on the mobile board",
    description:
      "Prevent cards from stretching the layout and keep column actions reachable on small screens.",
    status: "done",
    priority: "high",
    dueDate: dueIn(-2),
  },
];
