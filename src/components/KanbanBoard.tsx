import { COLUMNS } from "../data/columns";
import type { Task, TaskStatus } from "../types/task";
import { Column } from "./Column";

interface KanbanBoardProps {
  tasks: Task[];
  isFiltered: boolean;
  onCreateInColumn: (status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMove: (task: Task, direction: -1 | 1) => void;
}

/** Lays out one {@link Column} per status, filtering tasks into each. */
export function KanbanBoard({
  tasks,
  isFiltered,
  onCreateInColumn,
  onEdit,
  onDelete,
  onMove,
}: KanbanBoardProps) {
  return (
    <div className="board">
      {COLUMNS.map((column) => (
        <Column
          key={column.id}
          column={column}
          tasks={tasks.filter((task) => task.status === column.id)}
          isFiltered={isFiltered}
          onCreate={() => onCreateInColumn(column.id)}
          onEdit={onEdit}
          onDelete={onDelete}
          onMove={onMove}
        />
      ))}
    </div>
  );
}
