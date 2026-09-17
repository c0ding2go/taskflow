import { describe, expect, it } from "vitest";
import { getAdjacentStatus, getColumn } from "./columns";

describe("getAdjacentStatus", () => {
  it("moves forward through the board", () => {
    expect(getAdjacentStatus("backlog", 1)).toBe("in-progress");
    expect(getAdjacentStatus("in-progress", 1)).toBe("done");
    expect(getAdjacentStatus("done", 1)).toBeNull();
  });

  it("moves backward through the board", () => {
    expect(getAdjacentStatus("done", -1)).toBe("in-progress");
    expect(getAdjacentStatus("in-progress", -1)).toBe("backlog");
    expect(getAdjacentStatus("backlog", -1)).toBeNull();
  });
});

describe("getColumn", () => {
  it("returns the matching column definition", () => {
    expect(getColumn("in-progress").title).toBe("In Progress");
  });
});
