import type { DueDateFilter, Task } from "../types/task";

export type DueDateUrgency = "overdue" | "due-soon" | "upcoming";

/** Inclusive window: today plus the next two calendar days. */
export const DUE_SOON_DAYS = 2;

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function todayDate(now = new Date()): Date {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function addDays(date: Date, days: number): Date {
  const next = todayDate(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function msUntilNextLocalMidnight(now = new Date()): number {
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return Math.max(nextMidnight.getTime() - now.getTime(), 1);
}

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseISODate(value: string): Date | null {
  const match = ISO_DATE.exec(value);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function normalizeDueDate(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed || !parseISODate(trimmed)) {
    return undefined;
  }

  return trimmed;
}

export function getISOWeekRange(now = new Date()): { start: Date; end: Date } {
  const today = todayDate(now);
  const isoDay = today.getDay() === 0 ? 7 : today.getDay();
  const start = addDays(today, 1 - isoDay);
  const end = addDays(start, 6);
  return { start, end };
}

function calendarDaysFromToday(due: Date, now = new Date()): number {
  return Math.round((due.getTime() - todayDate(now).getTime()) / MS_PER_DAY);
}

export function isTaskOverdue(
  task: Pick<Task, "dueDate" | "status">,
  now = new Date(),
): boolean {
  if (!task.dueDate || task.status === "done") {
    return false;
  }

  const due = parseISODate(task.dueDate);
  return due !== null && calendarDaysFromToday(due, now) < 0;
}

export function isDueToday(task: Pick<Task, "dueDate">, now = new Date()): boolean {
  if (!task.dueDate) {
    return false;
  }

  const due = parseISODate(task.dueDate);
  return due !== null && calendarDaysFromToday(due, now) === 0;
}

export function isDueThisWeek(
  task: Pick<Task, "dueDate">,
  now = new Date(),
): boolean {
  if (!task.dueDate) {
    return false;
  }

  const due = parseISODate(task.dueDate);
  if (!due) {
    return false;
  }

  const { start, end } = getISOWeekRange(now);
  return due.getTime() >= start.getTime() && due.getTime() <= end.getTime();
}

export function getDueDateUrgency(
  task: Pick<Task, "dueDate" | "status">,
  now = new Date(),
): DueDateUrgency | null {
  if (!task.dueDate || task.status === "done") {
    return null;
  }

  const due = parseISODate(task.dueDate);
  if (!due) {
    return null;
  }

  const diffDays = calendarDaysFromToday(due, now);
  if (diffDays < 0) {
    return "overdue";
  }
  if (diffDays <= DUE_SOON_DAYS) {
    return "due-soon";
  }
  return "upcoming";
}

export function matchesDueDateFilter(
  task: Task,
  filter: DueDateFilter,
  now = new Date(),
): boolean {
  switch (filter) {
    case "all":
      return true;
    case "overdue":
      return isTaskOverdue(task, now);
    case "today":
      return isDueToday(task, now);
    case "this-week":
      return isDueThisWeek(task, now);
    case "none":
      return !task.dueDate;
    default:
      return true;
  }
}

export function formatDueDate(value: string, now = new Date()): string {
  const due = parseISODate(value);
  if (!due) {
    return value;
  }

  const diffDays = calendarDaysFromToday(due, now);
  if (diffDays === 0) {
    return "Today";
  }
  if (diffDays === 1) {
    return "Tomorrow";
  }
  if (diffDays === -1) {
    return "Yesterday";
  }

  const today = todayDate(now);
  return due.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: due.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
}

export function dueDateLabel(
  task: Pick<Task, "dueDate" | "status">,
  now = new Date(),
): string | null {
  if (!task.dueDate) {
    return null;
  }

  const when = formatDueDate(task.dueDate, now);
  return getDueDateUrgency(task, now) === "overdue" ? `Overdue · ${when}` : `Due ${when}`;
}

export function countOverdueTasks(
  tasks: Array<Pick<Task, "dueDate" | "status">>,
  now = new Date(),
): number {
  return tasks.reduce((total, task) => total + (isTaskOverdue(task, now) ? 1 : 0), 0);
}
