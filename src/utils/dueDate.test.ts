import { describe, expect, it } from "vitest";
import type { Task } from "../types/task";
import {
  addDays,
  dueDateLabel,
  formatDueDate,
  getDueDateUrgency,
  getISOWeekRange,
  isDueThisWeek,
  isDueToday,
  isTaskOverdue,
  matchesDueDateFilter,
  msUntilNextLocalMidnight,
  normalizeDueDate,
  parseISODate,
  toISODate,
  todayDate,
} from "./dueDate";

const NOW = new Date(2026, 8, 17, 15, 30, 0);

function task(overrides: Partial<Task> = {}): Task {
  return {
    id: "task",
    title: "Example",
    description: "",
    status: "backlog",
    priority: "medium",
    ...overrides,
  };
}

describe("parseISODate and toISODate", () => {
  it("parses a valid local calendar date", () => {
    expect(parseISODate("2026-09-17")).toEqual(new Date(2026, 8, 17));
  });

  it("rejects malformed and impossible dates", () => {
    expect(parseISODate("17-09-2026")).toBeNull();
    expect(parseISODate("2026-02-31")).toBeNull();
    expect(parseISODate("")).toBeNull();
  });

  it("round-trips a date through ISO formatting", () => {
    expect(toISODate(new Date(2026, 8, 7))).toBe("2026-09-07");
  });
});

describe("normalizeDueDate", () => {
  it("keeps a valid ISO date", () => {
    expect(normalizeDueDate(" 2026-09-17 ")).toBe("2026-09-17");
  });

  it("clears empty or invalid values", () => {
    expect(normalizeDueDate(undefined)).toBeUndefined();
    expect(normalizeDueDate("")).toBeUndefined();
    expect(normalizeDueDate("soon")).toBeUndefined();
  });
});

describe("week and day helpers", () => {
  it("strips the time from todayDate", () => {
    expect(todayDate(NOW)).toEqual(new Date(2026, 8, 17));
  });

  it("uses Monday-Sunday for the ISO week containing Thursday 17 Sep 2026", () => {
    expect(getISOWeekRange(NOW)).toEqual({
      start: new Date(2026, 8, 14),
      end: new Date(2026, 8, 20),
    });
  });

  it("keeps a Sunday in the week that started the previous Monday", () => {
    expect(getISOWeekRange(new Date(2026, 8, 20))).toEqual({
      start: new Date(2026, 8, 14),
      end: new Date(2026, 8, 20),
    });
  });

  it("adds calendar days without mutating the source", () => {
    const source = new Date(2026, 8, 17);
    expect(addDays(source, 3)).toEqual(new Date(2026, 8, 20));
    expect(source).toEqual(new Date(2026, 8, 17));
  });

  it("measures milliseconds until the next local midnight", () => {
    expect(msUntilNextLocalMidnight(new Date(2026, 8, 17, 23, 59, 0))).toBe(60_000);
    expect(msUntilNextLocalMidnight(new Date(2026, 8, 17, 0, 0, 0))).toBe(86_400_000);
  });
});

describe("deadline checks", () => {
  it("treats incomplete past-due work as overdue", () => {
    expect(isTaskOverdue(task({ dueDate: "2026-09-16" }), NOW)).toBe(true);
  });

  it("does not treat done tasks as overdue", () => {
    expect(
      isTaskOverdue(task({ dueDate: "2026-09-10", status: "done" }), NOW),
    ).toBe(false);
  });

  it("does not treat tasks without a due date as overdue", () => {
    expect(isTaskOverdue(task(), NOW)).toBe(false);
  });

  it("detects tasks due today", () => {
    expect(isDueToday(task({ dueDate: "2026-09-17" }), NOW)).toBe(true);
    expect(isDueToday(task({ dueDate: "2026-09-18" }), NOW)).toBe(false);
  });

  it("detects tasks due in the current ISO week", () => {
    expect(isDueThisWeek(task({ dueDate: "2026-09-14" }), NOW)).toBe(true);
    expect(isDueThisWeek(task({ dueDate: "2026-09-20" }), NOW)).toBe(true);
    expect(isDueThisWeek(task({ dueDate: "2026-09-13" }), NOW)).toBe(false);
    expect(isDueThisWeek(task({ dueDate: "2026-09-21" }), NOW)).toBe(false);
  });
});

describe("getDueDateUrgency", () => {
  it("returns overdue, due soon, and upcoming for incomplete work", () => {
    expect(getDueDateUrgency(task({ dueDate: "2026-09-16" }), NOW)).toBe("overdue");
    expect(getDueDateUrgency(task({ dueDate: "2026-09-17" }), NOW)).toBe("due-soon");
    expect(getDueDateUrgency(task({ dueDate: "2026-09-19" }), NOW)).toBe("due-soon");
    expect(getDueDateUrgency(task({ dueDate: "2026-09-20" }), NOW)).toBe("upcoming");
  });

  it("returns no urgency for done tasks or tasks without a due date", () => {
    expect(getDueDateUrgency(task({ dueDate: "2026-09-16", status: "done" }), NOW)).toBeNull();
    expect(getDueDateUrgency(task(), NOW)).toBeNull();
  });
});

describe("matchesDueDateFilter", () => {
  const overdue = task({ id: "overdue", dueDate: "2026-09-15" });
  const today = task({ id: "today", dueDate: "2026-09-17" });
  const laterThisWeek = task({ id: "week", dueDate: "2026-09-19" });
  const none = task({ id: "none" });
  const donePast = task({ id: "done", dueDate: "2026-09-10", status: "done" });

  it("keeps every task for the all filter", () => {
    expect(matchesDueDateFilter(none, "all", NOW)).toBe(true);
  });

  it("matches overdue incomplete tasks only", () => {
    expect(matchesDueDateFilter(overdue, "overdue", NOW)).toBe(true);
    expect(matchesDueDateFilter(donePast, "overdue", NOW)).toBe(false);
    expect(matchesDueDateFilter(today, "overdue", NOW)).toBe(false);
  });

  it("matches tasks due today", () => {
    expect(matchesDueDateFilter(today, "today", NOW)).toBe(true);
    expect(matchesDueDateFilter(laterThisWeek, "today", NOW)).toBe(false);
  });

  it("matches tasks due this week", () => {
    expect(matchesDueDateFilter(today, "this-week", NOW)).toBe(true);
    expect(matchesDueDateFilter(laterThisWeek, "this-week", NOW)).toBe(true);
    expect(matchesDueDateFilter(overdue, "this-week", NOW)).toBe(true);
    expect(matchesDueDateFilter(donePast, "this-week", NOW)).toBe(false);
  });

  it("matches tasks without a due date", () => {
    expect(matchesDueDateFilter(none, "none", NOW)).toBe(true);
    expect(matchesDueDateFilter(today, "none", NOW)).toBe(false);
  });
});

describe("formatDueDate and dueDateLabel", () => {
  it("uses relative labels for nearby dates", () => {
    expect(formatDueDate("2026-09-17", NOW)).toBe("Today");
    expect(formatDueDate("2026-09-18", NOW)).toBe("Tomorrow");
    expect(formatDueDate("2026-09-16", NOW)).toBe("Yesterday");
  });

  it("builds an overdue label and a standard due label", () => {
    expect(dueDateLabel(task({ dueDate: "2026-09-16" }), NOW)).toBe(
      "Overdue · Yesterday",
    );
    expect(dueDateLabel(task({ dueDate: "2026-09-17" }), NOW)).toBe("Due Today");
    expect(dueDateLabel(task())).toBeNull();
  });
});
