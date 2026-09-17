export type TaskStatus = "backlog" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
}

export type TaskDraft = Omit<Task, "id">;

export interface TaskFilters {
  search: string;
  priority: TaskPriority | "all";
}

export interface ColumnDefinition {
  id: TaskStatus;
  title: string;
  description: string;
}

export interface TaskStats {
  total: number;
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<TaskPriority, number>;
  completionRate: number;
}
