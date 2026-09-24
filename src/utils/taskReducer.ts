import type { Task, TaskDraft, TaskStatus } from "../types/task";
import { normalizeDueDate } from "./dueDate";

export type TaskAction =
  | { type: "add"; task: Task }
  | { type: "update"; id: string; updates: Partial<TaskDraft> }
  | { type: "delete"; id: string }
  | { type: "move"; id: string; status: TaskStatus };

/** Builds a normalized {@link Task} from a draft and a generated id. */
export function createTask(draft: TaskDraft, id: string): Task {
  const task: Task = {
    id,
    title: draft.title.trim(),
    description: draft.description.trim(),
    status: draft.status,
    priority: draft.priority,
  };

  const dueDate = normalizeDueDate(draft.dueDate);
  if (dueDate) {
    task.dueDate = dueDate;
  }

  return task;
}

/** Reducer applying add/update/delete/move actions to the task list. */
export function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case "add":
      return [...state, action.task];
    case "update":
      return state.map((task) => {
        if (task.id !== action.id) {
          return task;
        }

        const { dueDate, ...rest } = action.updates;
        const next: Task = { ...task, ...rest };

        if ("dueDate" in action.updates) {
          const normalized = normalizeDueDate(dueDate);
          if (normalized) {
            next.dueDate = normalized;
          } else {
            delete next.dueDate;
          }
        }

        return next;
      });
    case "delete":
      return state.filter((task) => task.id !== action.id);
    case "move":
      return state.map((task) =>
        task.id === action.id ? { ...task, status: action.status } : task,
      );
    default:
      return state;
  }
}
