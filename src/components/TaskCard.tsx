import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { getAdjacentStatus, getColumn } from "../data/columns";
import type { Task } from "../types/task";
import { getDueDateUrgency } from "../utils/dueDate";
import { DueDateBadge } from "./DueDateBadge";
import { PriorityBadge } from "./PriorityBadge";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMove: (task: Task, direction: -1 | 1) => void;
}

/** Card showing a single task's details with move, edit, and delete actions. */
export function TaskCard({ task, onEdit, onDelete, onMove }: TaskCardProps) {
  const previousStatus = getAdjacentStatus(task.status, -1);
  const nextStatus = getAdjacentStatus(task.status, 1);
  const urgency = getDueDateUrgency(task);
  const cardClassName = [
    "task-card",
    urgency === "overdue" ? "task-card--overdue" : "",
    urgency === "due-soon" ? "task-card--due-soon" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClassName}>
      <header className="task-card__header">
        <h3 className="task-card__title">{task.title}</h3>
        <PriorityBadge priority={task.priority} />
      </header>
      {task.description ? (
        <p className="task-card__description">{task.description}</p>
      ) : (
        <p className="task-card__description task-card__description--empty">
          No description
        </p>
      )}
      <DueDateBadge task={task} />
      <footer className="task-card__actions">
        <div className="task-card__move">
          <button
            type="button"
            className="icon-button"
            onClick={() => onMove(task, -1)}
            disabled={!previousStatus}
            aria-label={
              previousStatus
                ? `Move ${task.title} to ${getColumn(previousStatus).title}`
                : `${task.title} is already in the first column`
            }
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={() => onMove(task, 1)}
            disabled={!nextStatus}
            aria-label={
              nextStatus
                ? `Move ${task.title} to ${getColumn(nextStatus).title}`
                : `${task.title} is already in the last column`
            }
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
        <div className="task-card__manage">
          <button
            type="button"
            className="icon-button"
            onClick={() => onEdit(task)}
            aria-label={`Edit ${task.title}`}
          >
            <Pencil size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-button icon-button--danger"
            onClick={() => onDelete(task)}
            aria-label={`Delete ${task.title}`}
          >
            <Trash2 size={15} aria-hidden="true" />
          </button>
        </div>
      </footer>
    </article>
  );
}
