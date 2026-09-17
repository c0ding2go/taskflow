import { AlertTriangle } from "lucide-react";
import { useEscapeKey } from "../hooks/useEscapeKey";
import { useFocusOnOpen } from "../hooks/useFocusOnOpen";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const cancelRef = useFocusOnOpen<HTMLButtonElement>(open);

  useEscapeKey(open, onCancel);

  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal modal--narrow"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="confirm-dialog">
          <div className="confirm-dialog__icon" aria-hidden="true">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h2 id="confirm-title">{title}</h2>
            <p id="confirm-description">{description}</p>
          </div>
        </div>
        <div className="modal__actions">
          <button
            ref={cancelRef}
            type="button"
            className="button button--ghost"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button type="button" className="button button--danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
