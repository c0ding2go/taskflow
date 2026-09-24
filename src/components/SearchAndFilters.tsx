import { Search } from "lucide-react";
import type { DueDateFilter, TaskFilters, TaskPriority } from "../types/task";

interface SearchAndFiltersProps {
  filters: TaskFilters;
  onSearchChange: (value: string) => void;
  onPriorityChange: (value: TaskPriority | "all") => void;
  onDueDateChange: (value: DueDateFilter) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

/** Search input and priority/due-date filter controls for the task list. */
export function SearchAndFilters({
  filters,
  onSearchChange,
  onPriorityChange,
  onDueDateChange,
  onReset,
  hasActiveFilters,
}: SearchAndFiltersProps) {
  return (
    <section className="filters" aria-label="Search and filter tasks">
      <div className="filters__search">
        <Search size={16} aria-hidden="true" className="filters__search-icon" />
        <label htmlFor="task-search" className="sr-only">
          Search tasks
        </label>
        <input
          id="task-search"
          type="search"
          value={filters.search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by title or description"
          autoComplete="off"
        />
      </div>
      <div className="filters__control">
        <label htmlFor="priority-filter">Priority</label>
        <select
          id="priority-filter"
          value={filters.priority}
          onChange={(event) =>
            onPriorityChange(event.target.value as TaskPriority | "all")
          }
        >
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div className="filters__control">
        <label htmlFor="due-date-filter">Due date</label>
        <select
          id="due-date-filter"
          value={filters.dueDate}
          onChange={(event) =>
            onDueDateChange(event.target.value as DueDateFilter)
          }
        >
          <option value="all">All due dates</option>
          <option value="overdue">Overdue</option>
          <option value="today">Due today</option>
          <option value="this-week">Due this week</option>
          <option value="none">No due date</option>
        </select>
      </div>
      {hasActiveFilters ? (
        <button type="button" className="button button--ghost" onClick={onReset}>
          Clear filters
        </button>
      ) : null}
    </section>
  );
}
