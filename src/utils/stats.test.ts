import { describe, expect, it } from "vitest";
import type { Task } from "../types/task";
import { getTaskStats } from "./stats";

const tasks: Task[] = [
  {
    id: "1",
    title: "Backlog high",
    description: "",
    status: "backlog",
    priority: "high",
  },
  {
    id: "2",
    title: "Progress medium",
    description: "",
    status: "in-progress",
    priority: "medium",
  },
  {
    id: "3",
    title: "Done low",
    description: "",
    status: "done",
    priority: "low",
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
    });
  });

  it("counts tasks by status and priority", () => {
    expect(getTaskStats(tasks)).toEqual({
      total: 4,
      byStatus: { backlog: 1, "in-progress": 1, done: 2 },
      byPriority: { low: 1, medium: 1, high: 2 },
      completionRate: 50,
    });
  });

  it("rounds the completion rate to the nearest percent", () => {
    const uneven: Task[] = [
      { ...tasks[0]!, id: "a" },
      { ...tasks[1]!, id: "b" },
      { ...tasks[2]!, id: "c" },
    ];

    expect(getTaskStats(uneven).completionRate).toBe(33);
  });
});
