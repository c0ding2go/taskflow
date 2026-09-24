import { Plus } from "lucide-react";
import type { ColumnDefinition, Task } from "../types/task";
import { EmptyState } from "./EmptyState";
import { TaskCard } from "./TaskCard";

interface ColumnProps {
  column: ColumnDefinition;
  tasks: Task[];
  isFiltered: boolean;
  onCreate: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMove: (task: Task, direction: -1 | 1) => void;
}

/** Renders a single board column with its header, task cards, and empty state. */
export function Column({
  column,
  tasks,
  isFiltered,
  onCreate,
  onEdit,
  onDelete,
  onMove,
}: ColumnProps) {
  const headingId = `${column.id}-heading`;

  return (
    <section className="column" aria-labelledby={headingId}>
      <header className="column__header">
        <div>
          <h2 id={headingId} className="column__title">
            {column.title}
            <span className="column__count" aria-label={`${tasks.length} tasks`}>
              {tasks.length}
            </span>
          </h2>
          <p className="column__description">{column.description}</p>
        </div>
        <button
          type="button"
          className="icon-button"
          onClick={onCreate}
          aria-label={`Add task to ${column.title}`}
        >
          <Plus size={16} aria-hidden="true" />
        </button>
      </header>
      <div className="column__body">
        {tasks.length === 0 ? (
          <EmptyState
            title={isFiltered ? "No matching tasks" : "No tasks yet"}
            description={
              isFiltered
                ? "Nothing in this column matches the current search or filters."
                : `Add a task to ${column.title} to start tracking work here.`
            }
          />
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
            />
          ))
        )}
      </div>
    </section>
  );
}
