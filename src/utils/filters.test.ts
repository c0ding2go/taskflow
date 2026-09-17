import { describe, expect, it } from "vitest";
import type { Task, TaskFilters } from "../types/task";
import { countVisibleTasks, filterTasks } from "./filters";

const NOW = new Date(2026, 8, 17);

const tasks: Task[] = [
  {
    id: "1",
    title: "Implement local persistence",
    description: "Save the board in localStorage",
    status: "in-progress",
    priority: "high",
    dueDate: "2026-09-16",
  },
  {
    id: "2",
    title: "Polish task card typography",
    description: "Improve title contrast and spacing",
    status: "done",
    priority: "low",
    dueDate: "2026-09-10",
  },
  {
    id: "3",
    title: "Review accessibility",
    description: "Check dialog labels and keyboard focus",
    status: "backlog",
    priority: "high",
    dueDate: "2026-09-17",
  },
  {
    id: "4",
    title: "Plan next milestone",
    description: "Sketch the following sprint",
    status: "backlog",
    priority: "medium",
    dueDate: "2026-09-19",
  },
  {
    id: "5",
    title: "Write release notes",
    description: "Summarize the latest board changes",
    status: "backlog",
    priority: "low",
  },
];

const allFilters: TaskFilters = { search: "", priority: "all", dueDate: "all" };

describe("filterTasks", () => {
  it("returns every task when no filters are active", () => {
    expect(filterTasks(tasks, allFilters, NOW)).toHaveLength(5);
  });

  it("matches title text case-insensitively", () => {
    const result = filterTasks(tasks, { search: "CARD", priority: "all", dueDate: "all" }, NOW);
    expect(result.map((task) => task.id)).toEqual(["2"]);
  });

  it("matches description text", () => {
    const result = filterTasks(
      tasks,
      { search: "localStorage", priority: "all", dueDate: "all" },
      NOW,
    );
    expect(result.map((task) => task.id)).toEqual(["1"]);
  });

  it("ignores surrounding whitespace in the search query", () => {
    const result = filterTasks(
      tasks,
      { search: "  accessibility  ", priority: "all", dueDate: "all" },
      NOW,
    );
    expect(result.map((task) => task.id)).toEqual(["3"]);
  });

  it("filters by priority", () => {
    const result = filterTasks(tasks, { search: "", priority: "high", dueDate: "all" }, NOW);
    expect(result.map((task) => task.id)).toEqual(["1", "3"]);
  });

  it("applies search and priority together", () => {
    const result = filterTasks(
      tasks,
      { search: "review", priority: "high", dueDate: "all" },
      NOW,
    );
    expect(result.map((task) => task.id)).toEqual(["3"]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(
      filterTasks(tasks, { search: "calendar", priority: "low", dueDate: "all" }, NOW),
    ).toEqual([]);
  });

  it("filters overdue incomplete tasks", () => {
    const result = filterTasks(
      tasks,
      { search: "", priority: "all", dueDate: "overdue" },
      NOW,
    );
    expect(result.map((task) => task.id)).toEqual(["1"]);
  });

  it("filters tasks due today", () => {
    const result = filterTasks(tasks, { search: "", priority: "all", dueDate: "today" }, NOW);
    expect(result.map((task) => task.id)).toEqual(["3"]);
  });

  it("filters tasks due this week", () => {
    const result = filterTasks(
      tasks,
      { search: "", priority: "all", dueDate: "this-week" },
      NOW,
    );
    expect(result.map((task) => task.id)).toEqual(["1", "3", "4"]);
  });

  it("filters tasks without a due date", () => {
    const result = filterTasks(tasks, { search: "", priority: "all", dueDate: "none" }, NOW);
    expect(result.map((task) => task.id)).toEqual(["5"]);
  });

  it("combines search with a due date filter", () => {
    const result = filterTasks(
      tasks,
      { search: "accessibility", priority: "all", dueDate: "today" },
      NOW,
    );
    expect(result.map((task) => task.id)).toEqual(["3"]);
  });
});

describe("countVisibleTasks", () => {
  it("reports visible and total counts", () => {
    expect(
      countVisibleTasks(tasks, { search: "", priority: "low", dueDate: "all" }, NOW),
    ).toEqual({
      visible: 2,
      total: 5,
    });
  });
});
