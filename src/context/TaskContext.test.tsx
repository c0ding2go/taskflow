import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { TaskProvider } from "../context/TaskContext";
import { useTasks } from "../hooks/useTasks";
import { STORAGE_KEY } from "../utils/storage";

function Harness() {
  const { tasks, addTask, updateTask, deleteTask, moveTask } = useTasks();

  return (
    <div>
      <p>count:{tasks.length}</p>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title}|{task.status}|{task.priority}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() =>
          addTask({
            title: "New persistence task",
            description: "Created in a test",
            status: "backlog",
            priority: "medium",
          })
        }
      >
        add
      </button>
      <button
        type="button"
        onClick={() => updateTask(tasks[0]?.id ?? "", { title: "Updated title" })}
      >
        update
      </button>
      <button
        type="button"
        onClick={() => deleteTask(tasks[0]?.id ?? "")}
      >
        delete
      </button>
      <button
        type="button"
        onClick={() => moveTask(tasks[0]?.id ?? "", "done")}
      >
        move
      </button>
    </div>
  );
}

describe("TaskContext state", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("hydrates sample tasks when storage is empty", () => {
    render(
      <TaskProvider>
        <Harness />
      </TaskProvider>,
    );

    expect(screen.getByText(/count:10/)).toBeInTheDocument();
    expect(screen.getByText(/Audit onboarding copy/)).toBeInTheDocument();
  });

  it("adds a task and persists it", async () => {
    const user = userEvent.setup();

    render(
      <TaskProvider>
        <Harness />
      </TaskProvider>,
    );

    await user.click(screen.getByRole("button", { name: "add" }));

    expect(screen.getByText(/count:11/)).toBeInTheDocument();
    expect(screen.getByText(/New persistence task/)).toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toContain("New persistence task");
  });

  it("updates, moves, and deletes tasks", async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: "keep-me",
          title: "Original title",
          description: "Keep this around",
          status: "backlog",
          priority: "low",
        },
      ]),
    );

    const user = userEvent.setup();

    render(
      <TaskProvider>
        <Harness />
      </TaskProvider>,
    );

    await user.click(screen.getByRole("button", { name: "update" }));
    expect(screen.getByText(/Updated title\|backlog\|low/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "move" }));
    expect(screen.getByText(/Updated title\|done\|low/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "delete" }));
    expect(screen.getByText(/count:0/)).toBeInTheDocument();
  });
});
