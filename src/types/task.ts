export type TaskStatus = "backlog" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type DueDateFilter = "all" | "overdue" | "today" | "this-week" | "none";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
}

export type TaskDraft = Omit<Task, "id">;

export interface TaskFilters {
  search: string;
  priority: TaskPriority | "all";
  dueDate: DueDateFilter;
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
  overdue: number;
}
