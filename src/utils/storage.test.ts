import { beforeEach, describe, expect, it } from "vitest";
import type { Task } from "../types/task";
import { loadTasks, saveTasks, STORAGE_KEY } from "./storage";

const validTask: Task = {
  id: "keep-me",
  title: "Original title",
  description: "Keep this around",
  status: "backlog",
  priority: "low",
};

describe("task storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("loads tasks that omit a due date", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([validTask]));
    expect(loadTasks()).toEqual([validTask]);
  });

  it("loads tasks that include a valid due date", () => {
    const dated = { ...validTask, dueDate: "2026-09-17" };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([dated]));
    expect(loadTasks()).toEqual([dated]);
  });

  it("rejects tasks with an invalid due date", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ ...validTask, dueDate: "next Friday" }]),
    );
    expect(loadTasks()).toBeNull();
  });

  it("persists the current board", () => {
    saveTasks([{ ...validTask, dueDate: "2026-09-18" }]);
    expect(localStorage.getItem(STORAGE_KEY)).toContain("2026-09-18");
  });
});
