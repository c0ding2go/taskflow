import type { Task, TaskFilters } from "../types/task";

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  const query = filters.search.trim().toLowerCase();

  return tasks.filter((task) => {
    const haystack = `${task.title} ${task.description}`.toLowerCase();
    const matchesSearch = query.length === 0 || haystack.includes(query);
    const matchesPriority =
      filters.priority === "all" || task.priority === filters.priority;

    return matchesSearch && matchesPriority;
  });
}

export function countVisibleTasks(
  tasks: Task[],
  filters: TaskFilters,
): { visible: number; total: number } {
  return {
    visible: filterTasks(tasks, filters).length,
    total: tasks.length,
  };
}
