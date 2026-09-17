import { Calendar } from "lucide-react";
import type { Task } from "../types/task";
import { dueDateLabel, getDueDateUrgency } from "../utils/dueDate";

interface DueDateBadgeProps {
  task: Task;
}

export function DueDateBadge({ task }: DueDateBadgeProps) {
  const label = dueDateLabel(task);
  if (!label || !task.dueDate) {
    return null;
  }

  const urgency = getDueDateUrgency(task);
  const className = [
    "due-date-badge",
    urgency === "overdue" ? "due-date-badge--overdue" : "",
    urgency === "due-soon" ? "due-date-badge--due-soon" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <p className={className}>
      <Calendar size={13} aria-hidden="true" />
      <span>{label}</span>
    </p>
  );
}
