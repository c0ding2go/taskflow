import { useMemo, useState } from "react";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { Header } from "./components/Header";
import { KanbanBoard } from "./components/KanbanBoard";
import { SearchAndFilters } from "./components/SearchAndFilters";
import { StatsBar } from "./components/StatsBar";
import { TaskModal } from "./components/TaskModal";
import { TaskProvider } from "./context/TaskContext";
import { getAdjacentStatus } from "./data/columns";
import { useTaskFilters } from "./hooks/useTaskFilters";
import { useTasks } from "./hooks/useTasks";
import type { Task, TaskDraft, TaskStatus } from "./types/task";
import { getTaskStats } from "./utils/stats";

function Workspace() {
  const { tasks, addTask, updateTask, deleteTask, moveTask } = useTasks();
  const {
    filters,
    visibleTasks,
    hasActiveFilters,
    sort,
    setSearch,
    setPriority,
    setDueDate,
    setSort,
    resetFilters,
    now,
  } = useTaskFilters(tasks);
  const stats = useMemo(() => getTaskStats(tasks, now), [tasks, now]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("backlog");
  const [taskPendingDelete, setTaskPendingDelete] = useState<Task | null>(null);

  const openCreateModal = (status: TaskStatus = "backlog") => {
    setEditingTask(null);
    setDefaultStatus(status);
    setModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setDefaultStatus(task.status);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = (draft: TaskDraft) => {
    if (editingTask) {
      updateTask(editingTask.id, draft);
    } else {
      addTask(draft);
    }
    closeModal();
  };

  const handleMove = (task: Task, direction: -1 | 1) => {
    const nextStatus = getAdjacentStatus(task.status, direction);
    if (nextStatus) {
      moveTask(task.id, nextStatus);
    }
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#board">
        Skip to board
      </a>
      <Header onCreateTask={() => openCreateModal("backlog")} />
      <main className="app-main">
        <StatsBar stats={stats} visibleCount={visibleTasks.length} filters={filters} />
        <SearchAndFilters
          filters={filters}
          sort={sort}
          onSearchChange={setSearch}
          onPriorityChange={setPriority}
          onDueDateChange={setDueDate}
          onSortChange={setSort}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
        <div id="board">
          <KanbanBoard
            tasks={visibleTasks}
            isFiltered={hasActiveFilters}
            onCreateInColumn={openCreateModal}
            onEdit={openEditModal}
            onDelete={setTaskPendingDelete}
            onMove={handleMove}
          />
        </div>
      </main>
      <TaskModal
        open={modalOpen}
        task={editingTask}
        defaultStatus={defaultStatus}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog
        open={Boolean(taskPendingDelete)}
        title="Delete this task?"
        description={
          taskPendingDelete
            ? `“${taskPendingDelete.title}” will be removed from the board. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete task"
        onCancel={() => setTaskPendingDelete(null)}
        onConfirm={() => {
          if (taskPendingDelete) {
            deleteTask(taskPendingDelete.id);
            setTaskPendingDelete(null);
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <Workspace />
    </TaskProvider>
  );
}
