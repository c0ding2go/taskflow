import { describe, expect, it } from "vitest";
import type { Task } from "../types/task";
import { sortTasks } from "./sort";

function task(overrides: Partial<Task>): Task {
  return {
    id: "task",
    title: "Example",
    description: "",
    status: "backlog",
    priority: "medium",
    ...overrides,
  };
}

describe("sortTasks", () => {
  const backlog: Task[] = [
    task({ id: "late", dueDate: "2026-09-20" }),
    task({ id: "early", dueDate: "2026-09-12" }),
    task({ id: "mid", dueDate: "2026-09-16" }),
  ];

  it("keeps the current board order", () => {
    expect(sortTasks(backlog, "board")).toBe(backlog);
    expect(sortTasks(backlog, "board").map((item) => item.id)).toEqual([
      "late",
      "early",
      "mid",
    ]);
  });

  it("sorts tasks with due dates earliest first within a column", () => {
    expect(sortTasks(backlog, "due-date").map((item) => item.id)).toEqual([
      "early",
      "mid",
      "late",
    ]);
  });

  it("sorts dated tasks earliest first while columns keep that relative order", () => {
    const tasks = [
      task({ id: "backlog-late", status: "backlog", dueDate: "2026-09-21" }),
      task({ id: "progress-mid", status: "in-progress", dueDate: "2026-09-18" }),
      task({ id: "backlog-early", status: "backlog", dueDate: "2026-09-14" }),
      task({ id: "done-soon", status: "done", dueDate: "2026-09-15" }),
    ];

    const sorted = sortTasks(tasks, "due-date");

    expect(sorted.filter((item) => item.status === "backlog").map((item) => item.id)).toEqual([
      "backlog-early",
      "backlog-late",
    ]);
    expect(sorted.filter((item) => item.status === "in-progress").map((item) => item.id)).toEqual([
      "progress-mid",
    ]);
    expect(sorted.filter((item) => item.status === "done").map((item) => item.id)).toEqual([
      "done-soon",
    ]);
  });

  it("keeps the original relative order when due dates are equal", () => {
    const sameDay = [
      task({ id: "first", dueDate: "2026-09-17" }),
      task({ id: "second", dueDate: "2026-09-17" }),
    ];

    expect(sortTasks(sameDay, "due-date").map((item) => item.id)).toEqual(["first", "second"]);
  });

  it("does not mutate the tasks array", () => {
    const originalIds = backlog.map((item) => item.id);

    const sorted = sortTasks(backlog, "due-date");

    expect(sorted).not.toBe(backlog);
    expect(backlog.map((item) => item.id)).toEqual(originalIds);
    expect(sorted.map((item) => item.id)).toEqual(["early", "mid", "late"]);
  });
});
