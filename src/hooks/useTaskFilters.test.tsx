import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Task } from "../types/task";
import { useTaskFilters } from "./useTaskFilters";

const tasks: Task[] = [
  {
    id: "due-16",
    title: "Already late",
    description: "",
    status: "backlog",
    priority: "high",
    dueDate: "2026-09-16",
  },
  {
    id: "due-17",
    title: "Due on the 17th",
    description: "",
    status: "in-progress",
    priority: "medium",
    dueDate: "2026-09-17",
  },
  {
    id: "due-18",
    title: "Due on the 18th",
    description: "",
    status: "backlog",
    priority: "low",
    dueDate: "2026-09-18",
  },
];

function visibleIds(result: { current: { visibleTasks: Task[] } }) {
  return result.current.visibleTasks.map((task) => task.id);
}

describe("useTaskFilters day rollover", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 17, 23, 59, 0));
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("recomputes due-today and overdue filters after local midnight", () => {
    const { result } = renderHook(() => useTaskFilters(tasks));

    act(() => {
      result.current.setDueDate("today");
    });
    expect(visibleIds(result)).toEqual(["due-17"]);

    act(() => {
      result.current.setDueDate("overdue");
    });
    expect(visibleIds(result)).toEqual(["due-16"]);

    act(() => {
      vi.advanceTimersByTime(61_000);
    });

    expect(visibleIds(result)).toEqual(["due-16", "due-17"]);

    act(() => {
      result.current.setDueDate("today");
    });
    expect(visibleIds(result)).toEqual(["due-18"]);
  });

  it("resyncs the local date when a background tab becomes visible after midnight", () => {
    vi.setSystemTime(new Date(2026, 8, 17, 10, 0, 0));
    const { result } = renderHook(() => useTaskFilters(tasks));

    act(() => {
      result.current.setDueDate("today");
    });
    expect(visibleIds(result)).toEqual(["due-17"]);

    act(() => {
      vi.setSystemTime(new Date(2026, 8, 18, 10, 0, 0));
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(visibleIds(result)).toEqual(["due-18"]);
  });

  it("clears the midnight timer on unmount", () => {
    const { unmount } = renderHook(() => useTaskFilters(tasks));
    expect(vi.getTimerCount()).toBeGreaterThan(0);

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
