import type { Task, TaskPriority, TaskStatus } from "../types/task";
import { parseISODate } from "./dueDate";

export const STORAGE_KEY = "taskflow.tasks";

const STATUSES: TaskStatus[] = ["backlog", "in-progress", "done"];
const PRIORITIES: TaskPriority[] = ["low", "medium", "high"];

/** Type guard checking whether `value` is a valid {@link TaskStatus}. */
function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === "string" && STATUSES.includes(value as TaskStatus);
}

/** Type guard checking whether `value` is a valid {@link TaskPriority}. */
function isTaskPriority(value: unknown): value is TaskPriority {
  return typeof value === "string" && PRIORITIES.includes(value as TaskPriority);
}

/** Returns true if `value` is undefined or a valid ISO due date string. */
function isOptionalDueDate(value: unknown): boolean {
  return value === undefined || (typeof value === "string" && parseISODate(value) !== null);
}

/** Type guard checking whether `value` is a well-formed {@link Task}. */
function isTask(value: unknown): value is Task {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<Task>;

  return (
    typeof candidate.id === "string" &&
    candidate.id.length > 0 &&
    typeof candidate.title === "string" &&
    typeof candidate.description === "string" &&
    isTaskStatus(candidate.status) &&
    isTaskPriority(candidate.priority) &&
    isOptionalDueDate(candidate.dueDate)
  );
}

/** Loads and validates tasks from localStorage, returning null if absent or invalid. */
export function loadTasks(): Task[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isTask)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

/** Persists the given tasks to localStorage as JSON. */
export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
