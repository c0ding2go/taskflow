import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { SAMPLE_TASKS } from "../data/sampleTasks";
import type { Task, TaskDraft, TaskStatus } from "../types/task";
import { createId } from "../utils/id";
import { loadTasks, saveTasks } from "../utils/storage";
import { createTask, taskReducer } from "../utils/taskReducer";

interface TaskContextValue {
  tasks: Task[];
  addTask: (draft: TaskDraft) => void;
  updateTask: (id: string, updates: Partial<TaskDraft>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: TaskStatus) => void;
}

const TaskContext = createContext<TaskContextValue | null>(null);

/** Loads persisted tasks, falling back to the bundled sample tasks. */
function getInitialTasks(): Task[] {
  return loadTasks() ?? SAMPLE_TASKS;
}

/** Provides task state and CRUD/move actions to descendants, persisting to storage. */
export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, dispatch] = useReducer(taskReducer, undefined, getInitialTasks);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((draft: TaskDraft) => {
    dispatch({ type: "add", task: createTask(draft, createId()) });
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<TaskDraft>) => {
    const nextUpdates = { ...updates };
    if (typeof nextUpdates.title === "string") {
      nextUpdates.title = nextUpdates.title.trim();
    }
    if (typeof nextUpdates.description === "string") {
      nextUpdates.description = nextUpdates.description.trim();
    }
    if ("dueDate" in nextUpdates) {
      nextUpdates.dueDate = nextUpdates.dueDate?.trim() || undefined;
    }
    dispatch({ type: "update", id, updates: nextUpdates });
  }, []);

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: "delete", id });
  }, []);

  const moveTask = useCallback((id: string, status: TaskStatus) => {
    dispatch({ type: "move", id, status });
  }, []);

  const value = useMemo(
    () => ({
      tasks,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
    }),
    [tasks, addTask, updateTask, deleteTask, moveTask],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

/** Accesses the task context; throws if used outside a {@link TaskProvider}. */
export function useTasks(): TaskContextValue {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
