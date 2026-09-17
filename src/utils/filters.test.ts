import { describe, expect, it } from "vitest";
import type { Task, TaskFilters } from "../types/task";
import { countVisibleTasks, filterTasks } from "./filters";

const tasks: Task[] = [
  {
    id: "1",
    title: "Implement local persistence",
    description: "Save the board in localStorage",
    status: "in-progress",
    priority: "high",
  },
  {
    id: "2",
    title: "Polish task card typography",
    description: "Improve title contrast and spacing",
    status: "done",
    priority: "low",
  },
  {
    id: "3",
    title: "Review accessibility",
    description: "Check dialog labels and keyboard focus",
    status: "backlog",
    priority: "high",
  },
];

const allFilters: TaskFilters = { search: "", priority: "all" };

describe("filterTasks", () => {
  it("returns every task when no filters are active", () => {
    expect(filterTasks(tasks, allFilters)).toHaveLength(3);
  });

  it("matches title text case-insensitively", () => {
    const result = filterTasks(tasks, { search: "CARD", priority: "all" });
    expect(result.map((task) => task.id)).toEqual(["2"]);
  });

  it("matches description text", () => {
    const result = filterTasks(tasks, { search: "localStorage", priority: "all" });
    expect(result.map((task) => task.id)).toEqual(["1"]);
  });

  it("ignores surrounding whitespace in the search query", () => {
    const result = filterTasks(tasks, { search: "  accessibility  ", priority: "all" });
    expect(result.map((task) => task.id)).toEqual(["3"]);
  });

  it("filters by priority", () => {
    const result = filterTasks(tasks, { search: "", priority: "high" });
    expect(result.map((task) => task.id)).toEqual(["1", "3"]);
  });

  it("applies search and priority together", () => {
    const result = filterTasks(tasks, { search: "review", priority: "high" });
    expect(result.map((task) => task.id)).toEqual(["3"]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterTasks(tasks, { search: "calendar", priority: "low" })).toEqual([]);
  });
});

describe("countVisibleTasks", () => {
  it("reports visible and total counts", () => {
    expect(countVisibleTasks(tasks, { search: "", priority: "low" })).toEqual({
      visible: 1,
      total: 3,
    });
  });
});
