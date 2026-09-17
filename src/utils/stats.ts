import type { Task, TaskPriority, TaskStats, TaskStatus } from "../types/task";
import { countOverdueTasks } from "./dueDate";

const EMPTY_STATUS_COUNTS: Record<TaskStatus, number> = {
  backlog: 0,
  "in-progress": 0,
  done: 0,
};

const EMPTY_PRIORITY_COUNTS: Record<TaskPriority, number> = {
  low: 0,
  medium: 0,
  high: 0,
};

export function getTaskStats(tasks: Task[], now = new Date()): TaskStats {
  const byStatus: Record<TaskStatus, number> = { ...EMPTY_STATUS_COUNTS };
  const byPriority: Record<TaskPriority, number> = { ...EMPTY_PRIORITY_COUNTS };

  for (const task of tasks) {
    byStatus[task.status] += 1;
    byPriority[task.priority] += 1;
  }

  const total = tasks.length;
  const completionRate = total === 0 ? 0 : Math.round((byStatus.done / total) * 100);

  return {
    total,
    byStatus,
    byPriority,
    completionRate,
    overdue: countOverdueTasks(tasks, now),
  };
}
