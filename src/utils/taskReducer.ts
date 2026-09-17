import type { Task, TaskDraft, TaskStatus } from "../types/task";

export type TaskAction =
  | { type: "add"; task: Task }
  | { type: "update"; id: string; updates: Partial<TaskDraft> }
  | { type: "delete"; id: string }
  | { type: "move"; id: string; status: TaskStatus };

export function createTask(draft: TaskDraft, id: string): Task {
  return {
    id,
    title: draft.title.trim(),
    description: draft.description.trim(),
    status: draft.status,
    priority: draft.priority,
  };
}

export function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case "add":
      return [...state, action.task];
    case "update":
      return state.map((task) =>
        task.id === action.id ? { ...task, ...action.updates } : task,
      );
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
