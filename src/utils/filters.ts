import type { Task, TaskFilters } from "../types/task";
import { matchesDueDateFilter } from "./dueDate";

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
