import { Search } from "lucide-react";
import type { DueDateFilter, TaskFilters, TaskPriority, TaskSort } from "../types/task";

interface SearchAndFiltersProps {
  filters: TaskFilters;
  sort: TaskSort;
  onSearchChange: (value: string) => void;
  onPriorityChange: (value: TaskPriority | "all") => void;
  onDueDateChange: (value: DueDateFilter) => void;
  onSortChange: (value: TaskSort) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export function SearchAndFilters({
  filters,
  sort,
  onSearchChange,
  onPriorityChange,
  onDueDateChange,
  onSortChange,
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
      <div className="filters__control">
        <label htmlFor="task-sort">Sort</label>
        <select
          id="task-sort"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as TaskSort)}
        >
          <option value="board">Board order</option>
          <option value="due-date">Due date</option>
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
