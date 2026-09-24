import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  CircleDot,
  LayoutList,
  ListTodo,
} from "lucide-react";
import type { TaskFilters, TaskStats } from "../types/task";

interface StatsBarProps {
  stats: TaskStats;
  visibleCount: number;
  filters: TaskFilters;
}

/** Displays summary statistics for the workspace's tasks. */
export function StatsBar({ stats, visibleCount, filters }: StatsBarProps) {
  const isFiltered =
    filters.search.trim().length > 0 ||
    filters.priority !== "all" ||
    filters.dueDate !== "all";

  return (
    <section className="stats-bar" aria-label="Workspace statistics">
      <article className="stat-card">
        <div className="stat-card__icon" aria-hidden="true">
          <LayoutList size={16} />
        </div>
        <div>
          <p className="stat-card__label">Total tasks</p>
          <p className="stat-card__value">{stats.total}</p>
        </div>
      </article>
      <article className="stat-card">
        <div className="stat-card__icon" aria-hidden="true">
          <ListTodo size={16} />
        </div>
        <div>
          <p className="stat-card__label">Backlog</p>
          <p className="stat-card__value">{stats.byStatus.backlog}</p>
        </div>
      </article>
      <article className="stat-card">
        <div className="stat-card__icon" aria-hidden="true">
          <CircleDot size={16} />
        </div>
        <div>
          <p className="stat-card__label">In progress</p>
          <p className="stat-card__value">{stats.byStatus["in-progress"]}</p>
        </div>
      </article>
      <article className="stat-card">
        <div className="stat-card__icon" aria-hidden="true">
          <CheckCircle2 size={16} />
        </div>
        <div>
          <p className="stat-card__label">Done</p>
          <p className="stat-card__value">{stats.byStatus.done}</p>
        </div>
      </article>
      <article className="stat-card">
        <div className="stat-card__icon stat-card__icon--warning" aria-hidden="true">
          <AlertCircle size={16} />
        </div>
        <div>
          <p className="stat-card__label">High priority</p>
          <p className="stat-card__value">{stats.byPriority.high}</p>
        </div>
      </article>
      <article className="stat-card">
        <div className="stat-card__icon stat-card__icon--danger" aria-hidden="true">
          <CalendarClock size={16} />
        </div>
        <div>
          <p className="stat-card__label">Overdue</p>
          <p className="stat-card__value">{stats.overdue}</p>
        </div>
      </article>
      <article className="stat-card">
        <div>
          <p className="stat-card__label">Completion</p>
          <p className="stat-card__value">{stats.completionRate}%</p>
          {isFiltered ? (
            <p className="stat-card__hint">
              Showing {visibleCount} of {stats.total}
            </p>
          ) : (
            <p className="stat-card__hint">Share of tasks in Done</p>
          )}
        </div>
      </article>
    </section>
  );
}
