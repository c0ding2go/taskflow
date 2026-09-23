import { useMemo, useState } from "react";
import type { DueDateFilter, Task, TaskFilters, TaskPriority, TaskSort } from "../types/task";
import { parseISODate } from "../utils/dueDate";
import { filterTasks } from "../utils/filters";
import { sortTasks } from "../utils/sort";
import { useLocalCalendarDay } from "./useLocalCalendarDay";

const DEFAULT_FILTERS: TaskFilters = {
  search: "",
  priority: "all",
  dueDate: "all",
};

export function useTaskFilters(tasks: Task[]) {
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<TaskSort>("board");
  const today = useLocalCalendarDay();
  const now = useMemo(() => parseISODate(today) ?? new Date(), [today]);

  const visibleTasks = useMemo(
    () => sortTasks(filterTasks(tasks, filters, now), sort),
    [tasks, filters, now, sort],
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
    sort,
    visibleTasks,
    hasActiveFilters,
    now,
    setSearch,
    setPriority,
    setDueDate,
    setSort,
    resetFilters,
  };
}
