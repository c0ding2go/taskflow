import { Columns3, Plus } from "lucide-react";

interface HeaderProps {
  onCreateTask: () => void;
}

export function Header({ onCreateTask }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__mark" aria-hidden="true">
          <Columns3 size={18} />
        </span>
        <div>
          <p className="app-header__name">TaskFlow</p>
          <p className="app-header__tagline">
            Organize work. Track progress. Stay in flow.
          </p>
        </div>
      </div>
      <button type="button" className="button button--primary" onClick={onCreateTask}>
        <Plus size={16} aria-hidden="true" />
        New task
      </button>
    </header>
  );
}
