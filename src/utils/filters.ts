import type { Task, TaskFilters } from "../types/task";
import { matchesDueDateFilter } from "./dueDate";

/** Filters tasks by search text, priority, and due-date criteria. */
export function filterTasks(
  tasks: Task[],
  filters: TaskFilters,
  now = new Date(),
): Task[] {
  const query = filters.search.trim().toLowerCase();

  return tasks.filter((task) => {
    const haystack = `${task.title} ${task.description}`.toLowerCase();
    const matchesSearch = query.length === 0 || haystack.includes(query);
    const matchesPriority =
      filters.priority === "all" || task.priority === filters.priority;
    const matchesDueDate = matchesDueDateFilter(task, filters.dueDate, now);

    return matchesSearch && matchesPriority && matchesDueDate;
  });
}

/** Returns the count of tasks matching `filters` alongside the total task count. */
export function countVisibleTasks(
  tasks: Task[],
  filters: TaskFilters,
  now = new Date(),
): { visible: number; total: number } {
  return {
    visible: filterTasks(tasks, filters, now).length,
    total: tasks.length,
  };
}
