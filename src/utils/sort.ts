import type { Task, TaskSort } from "../types/task";

export function sortTasks(tasks: Task[], sort: TaskSort): Task[] {
  if (sort !== "due-date") {
    return tasks;
  }

  return tasks.slice().sort(compareByDueDate);
}

function compareByDueDate(left: Task, right: Task): number {
  const leftDue = left.dueDate ?? "";
  const rightDue = right.dueDate ?? "";

  if (leftDue === rightDue) {
    return 0;
  }

  return leftDue < rightDue ? -1 : 1;
}
