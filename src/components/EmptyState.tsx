import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

/** Generic placeholder shown when a list has no items to display. */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <Inbox aria-hidden="true" className="empty-state__icon" />
      <p className="empty-state__title">{title}</p>
      <p className="empty-state__description">{description}</p>
      {action}
    </div>
  );
}
