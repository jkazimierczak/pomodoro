import { Temporal } from "@js-temporal/polyfill";
import { FinishedPomodoro } from "@/features/Timer";

export const LS_PROGRESS_KEY = "progressHistory";

export function getStoredProgressHistory(): FinishedPomodoro[] {
  const storedProgress = localStorage.getItem(LS_PROGRESS_KEY);
  return storedProgress ? JSON.parse(storedProgress) : [];
}

export function getStoredProgressHistorySince(since: Temporal.PlainDateTime) {
  const storedProgress = getStoredProgressHistory();
  return filterProgressSince(since, storedProgress);
}

function filterProgressSince(since: Temporal.PlainDateTime, pomodoroHistory: FinishedPomodoro[]) {
  return pomodoroHistory.filter((pomodoro) => {
    const pomodoroDate = Temporal.PlainDateTime.from(pomodoro.finishedAt);
    return Temporal.PlainDateTime.compare(since, pomodoroDate) <= 0;
  });
}
