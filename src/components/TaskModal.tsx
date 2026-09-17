import { useEffect, useId, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { COLUMNS } from "../data/columns";
import { useEscapeKey } from "../hooks/useEscapeKey";
import { useFocusOnOpen } from "../hooks/useFocusOnOpen";
import type { Task, TaskDraft, TaskPriority, TaskStatus } from "../types/task";

interface TaskModalProps {
  open: boolean;
  task: Task | null;
  defaultStatus: TaskStatus;
  onClose: () => void;
  onSubmit: (draft: TaskDraft) => void;
}

const PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function TaskModal({
  open,
  task,
  defaultStatus,
  onClose,
  onSubmit,
}: TaskModalProps) {
  const titleId = useId();
  const titleFieldId = useId();
  const descriptionFieldId = useId();
  const statusFieldId = useId();
  const priorityFieldId = useId();
  const dueDateFieldId = useId();
  const dueDateHintId = useId();
  const errorId = useId();
  const titleInputRef = useFocusOnOpen<HTMLInputElement>(open);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setStatus(task?.status ?? defaultStatus);
    setPriority(task?.priority ?? "medium");
    setDueDate(task?.dueDate ?? "");
    setError("");
  }, [open, task, defaultStatus]);

  useEscapeKey(open, onClose);

  if (!open) {
    return null;
  }

  const isEditing = Boolean(task);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("A title is required.");
      titleInputRef.current?.focus();
      return;
    }

    onSubmit({
      title: trimmedTitle,
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate || undefined,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal__header">
          <h2 id={titleId}>{isEditing ? "Edit task" : "Create task"}</h2>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </header>
        <form className="task-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor={titleFieldId}>Title</label>
            <input
              ref={titleInputRef}
              id={titleFieldId}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (error) {
                  setError("");
                }
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              required
              maxLength={120}
            />
            {error ? (
              <p id={errorId} className="field__error" role="alert">
                {error}
              </p>
            ) : null}
          </div>
          <div className="field">
            <label htmlFor={descriptionFieldId}>Description</label>
            <textarea
              id={descriptionFieldId}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              maxLength={600}
            />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor={statusFieldId}>Status</label>
              <select
                id={statusFieldId}
                value={status}
                onChange={(event) => setStatus(event.target.value as TaskStatus)}
              >
                {COLUMNS.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor={priorityFieldId}>Priority</label>
              <select
                id={priorityFieldId}
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as TaskPriority)
                }
              >
                {PRIORITIES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor={dueDateFieldId}>Due date</label>
            <input
              id={dueDateFieldId}
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              aria-describedby={dueDateHintId}
            />
            <p id={dueDateHintId} className="field__hint">
              Optional. Leave empty if the task has no deadline.
            </p>
          </div>
          <div className="modal__actions">
            <button type="button" className="button button--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button button--primary">
              {isEditing ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
