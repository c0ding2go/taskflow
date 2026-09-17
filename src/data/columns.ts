import type { ColumnDefinition, TaskStatus } from "../types/task";

export const COLUMNS: ColumnDefinition[] = [
  {
    id: "backlog",
    title: "Backlog",
    description: "Work that is queued but not started",
  },
  {
    id: "in-progress",
    title: "In Progress",
    description: "Work currently underway",
  },
  {
    id: "done",
    title: "Done",
    description: "Completed work",
  },
];

export const STATUS_ORDER: TaskStatus[] = COLUMNS.map((column) => column.id);

export function getColumn(status: TaskStatus): ColumnDefinition {
  const column = COLUMNS.find((item) => item.id === status);
  if (!column) {
    throw new Error(`Unknown status: ${status}`);
  }
  return column;
}

export function getAdjacentStatus(
  status: TaskStatus,
  direction: -1 | 1,
): TaskStatus | null {
  const index = STATUS_ORDER.indexOf(status);
  const nextIndex = index + direction;
  return STATUS_ORDER[nextIndex] ?? null;
}
