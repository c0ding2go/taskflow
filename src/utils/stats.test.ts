import { describe, expect, it } from "vitest";
import type { Task } from "../types/task";
import { getTaskStats } from "./stats";

const NOW = new Date(2026, 8, 17);

const tasks: Task[] = [
  {
    id: "1",
    title: "Backlog high",
    description: "",
    status: "backlog",
    priority: "high",
    dueDate: "2026-09-15",
  },
  {
    id: "2",
    title: "Progress medium",
    description: "",
    status: "in-progress",
    priority: "medium",
    dueDate: "2026-09-17",
  },
  {
    id: "3",
    title: "Done low",
    description: "",
    status: "done",
    priority: "low",
    dueDate: "2026-09-10",
  },
  {
    id: "4",
    title: "Done high",
    description: "",
    status: "done",
    priority: "high",
  },
];

describe("getTaskStats", () => {
  it("returns zeroed stats for an empty board", () => {
    expect(getTaskStats([])).toEqual({
      total: 0,
      byStatus: { backlog: 0, "in-progress": 0, done: 0 },
      byPriority: { low: 0, medium: 0, high: 0 },
      completionRate: 0,
      overdue: 0,
    });
  });

  it("counts tasks by status and priority", () => {
    expect(getTaskStats(tasks, NOW)).toEqual({
      total: 4,
      byStatus: { backlog: 1, "in-progress": 1, done: 2 },
      byPriority: { low: 1, medium: 1, high: 2 },
      completionRate: 50,
      overdue: 1,
    });
  });

  it("counts only incomplete past-due tasks as overdue", () => {
    const mixed: Task[] = [
      { ...tasks[0]!, id: "overdue-backlog" },
      {
        id: "overdue-progress",
        title: "Late progress",
        description: "",
        status: "in-progress",
        priority: "high",
        dueDate: "2026-09-01",
      },
      { ...tasks[2]!, id: "done-past-due" },
      {
        id: "no-date",
        title: "Undated",
        description: "",
        status: "backlog",
        priority: "low",
      },
    ];

    expect(getTaskStats(mixed, NOW).overdue).toBe(2);
  });

  it("rounds the completion rate to the nearest percent", () => {
    const uneven: Task[] = [
      { ...tasks[0]!, id: "a" },
      { ...tasks[1]!, id: "b" },
      { ...tasks[2]!, id: "c" },
    ];

    expect(getTaskStats(uneven, NOW).completionRate).toBe(33);
  });
});
