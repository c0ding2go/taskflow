import { useEffect, useRef, type RefObject } from "react";

export function useFocusOnOpen<T extends HTMLElement>(
  open: boolean,
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (open) {
      ref.current?.focus();
    }
  }, [open]);

  return ref;
}
