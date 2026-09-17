import { useMemo, useState } from "react";
import type { DueDateFilter, Task, TaskFilters, TaskPriority } from "../types/task";
import { filterTasks } from "../utils/filters";

const DEFAULT_FILTERS: TaskFilters = {
  search: "",
  priority: "all",
  dueDate: "all",
};

export function useTaskFilters(tasks: Task[]) {
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS);

  const visibleTasks = useMemo(
    () => filterTasks(tasks, filters),
    [tasks, filters],
  );

  const setSearch = (search: string) => {
    setFilters((current) => ({ ...current, search }));
  };

  const setPriority = (priority: TaskPriority | "all") => {
    setFilters((current) => ({ ...current, priority }));
  };

  const setDueDate = (dueDate: DueDateFilter) => {
    setFilters((current) => ({ ...current, dueDate }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const hasActiveFilters =
    filters.search.trim().length > 0 ||
    filters.priority !== "all" ||
    filters.dueDate !== "all";

  return {
    filters,
    visibleTasks,
    hasActiveFilters,
    setSearch,
    setPriority,
    setDueDate,
    resetFilters,
  };
}
