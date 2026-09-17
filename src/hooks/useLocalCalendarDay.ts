import { useEffect, useState } from "react";
import { msUntilNextLocalMidnight, toISODate } from "../utils/dueDate";

export function useLocalCalendarDay() {
  const [day, setDay] = useState(() => toISODate(new Date()));

  useEffect(() => {
    let timeoutId: ReturnType<typeof window.setTimeout>;

    const syncDay = () => {
      const nextDay = toISODate(new Date());
      setDay((current) => (current === nextDay ? current : nextDay));
    };

    const schedule = () => {
      timeoutId = window.setTimeout(() => {
        syncDay();
        schedule();
      }, msUntilNextLocalMidnight());
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        return;
      }

      window.clearTimeout(timeoutId);
      syncDay();
      schedule();
    };

    schedule();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return day;
}
