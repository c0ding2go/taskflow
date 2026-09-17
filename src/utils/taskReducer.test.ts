import { describe, expect, it } from "vitest";
import type { Task } from "../types/task";
import { createTask, taskReducer } from "./taskReducer";

const seed: Task[] = [
  {
    id: "alpha",
    title: "Draft copy",
    description: "Write the first pass",
    status: "backlog",
    priority: "medium",
    dueDate: "2026-09-20",
  },
];

describe("createTask", () => {
  it("trims title and description before creating a task", () => {
    expect(
      createTask(
        {
          title: "  Review dialogs  ",
          description: "  Check labels  ",
          status: "backlog",
          priority: "high",
        },
        "generated-id",
      ),
    ).toEqual({
      id: "generated-id",
      title: "Review dialogs",
      description: "Check labels",
      status: "backlog",
      priority: "high",
    });
  });

  it("keeps a valid due date on a new task", () => {
    expect(
      createTask(
        {
          title: "Ship reminder",
          description: "",
          status: "in-progress",
          priority: "medium",
          dueDate: "2026-09-17",
        },
        "dated",
      ).dueDate,
    ).toBe("2026-09-17");
  });

  it("omits empty or invalid due dates", () => {
    expect(
      createTask(
        {
          title: "Undated",
          description: "",
          status: "backlog",
          priority: "low",
          dueDate: "  ",
        },
        "undated",
      ).dueDate,
    ).toBeUndefined();
  });
});

describe("taskReducer", () => {
  it("adds a task to the board", () => {
    const next = createTask(
      {
        title: "Write tests",
        description: "Cover reducer actions",
        status: "in-progress",
        priority: "high",
      },
      "beta",
    );

    expect(taskReducer(seed, { type: "add", task: next })).toEqual([...seed, next]);
  });

  it("updates an existing task", () => {
    const result = taskReducer(seed, {
      type: "update",
      id: "alpha",
      updates: { title: "Draft final copy", priority: "high" },
    });

    expect(result[0]).toMatchObject({
      id: "alpha",
      title: "Draft final copy",
      description: "Write the first pass",
      priority: "high",
      dueDate: "2026-09-20",
    });
  });

  it("sets and clears a due date during an update", () => {
    const dated = taskReducer(seed, {
      type: "update",
      id: "alpha",
      updates: { dueDate: "2026-09-22" },
    });
    expect(dated[0]?.dueDate).toBe("2026-09-22");

    const cleared = taskReducer(dated, {
      type: "update",
      id: "alpha",
      updates: { dueDate: undefined },
    });
    expect(cleared[0]?.dueDate).toBeUndefined();
  });

  it("does not mutate unrelated tasks during an update", () => {
    const extra: Task = {
      id: "gamma",
      title: "Ship stats",
      description: "",
      status: "done",
      priority: "low",
    };

    const result = taskReducer([...seed, extra], {
      type: "update",
      id: "alpha",
      updates: { status: "in-progress" },
    });

    expect(result[1]).toEqual(extra);
  });

  it("deletes a task by id", () => {
    expect(taskReducer(seed, { type: "delete", id: "alpha" })).toEqual([]);
  });

  it("moves a task to another column", () => {
    const result = taskReducer(seed, { type: "move", id: "alpha", status: "done" });
    expect(result[0]?.status).toBe("done");
  });
});
