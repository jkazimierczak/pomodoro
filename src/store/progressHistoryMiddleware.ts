import { createListenerMiddleware } from "@reduxjs/toolkit";
import { FinishedPomodoro, PomodoroType, resetProgress } from "@/features/Timer/timerSlice";
import { Temporal } from "@js-temporal/polyfill";
import { AppStartListening } from "@/store/store";

const LS_PROGRESS_KEY = "progressHistory";

export function getStoredProgressHistory() {
  const storedProgress = localStorage.getItem(LS_PROGRESS_KEY);
  return storedProgress ? JSON.parse(storedProgress) : [];
}

export const progressMiddleware = createListenerMiddleware();
export const startAppListening = progressMiddleware.startListening as AppStartListening;

startAppListening({
  predicate: (action, currentState, originalState) => {
    const previousType = originalState.timer.currentSession.type;
    const currentType = currentState.timer.currentSession.type;
    return (
      previousType === PomodoroType.SESSION &&
      (currentType === PomodoroType.BREAK || currentType === PomodoroType.LONG_BREAK)
    );
  },
  effect: (action, listenerApi) => {
    const state = listenerApi.getState().timer;
    const stored: FinishedPomodoro[] = getStoredProgressHistory();

    let newestStored: Temporal.PlainDateTime;
    if (stored.length === 0) {
      newestStored = Temporal.PlainDateTime.from("1970-01-01");
    } else {
      const storedDates = stored.map((item) => Temporal.PlainDateTime.from(item.finishedAt));
      newestStored = storedDates[storedDates.length - 1];
    }

    // Determine newest, not-stored pomodoros, and save them
    const newerThanStored = state.history.filter((item) => {
      const storedFinishedAt = Temporal.PlainDateTime.from(item.finishedAt);
      return Temporal.PlainDateTime.compare(newestStored, storedFinishedAt) === -1;
    });

    localStorage.setItem(LS_PROGRESS_KEY, JSON.stringify([...stored, ...newerThanStored]));

    if (state.currentSessionIdx === state.settings.dailyGoal) {
      listenerApi.dispatch(resetProgress());
    }
  },
});
