import type { TaskPriority } from "../types/task";

const LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

interface PriorityBadgeProps {
  priority: TaskPriority;
}

/** Small colored badge that labels a task's priority level. */
export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span className={`priority-badge priority-badge--${priority}`}>
      {LABELS[priority]}
    </span>
  );
}
