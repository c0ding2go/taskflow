import { useEffect } from "react";

/** Calls `onEscape` when the Escape key is pressed while `enabled` is true. */
export function useEscapeKey(enabled: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onEscape();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onEscape]);
}
