import { Temporal } from "@js-temporal/polyfill";
import { AnyAction, createListenerMiddleware } from "@reduxjs/toolkit";

import { AppStartListening, finishDailyGoal,RootState } from "@/app";
import { FinishedPomodoro, PomodoroType, resetProgress } from "@/features/Timer/timerSlice";

const LS_PROGRESS_KEY = "progressHistory";

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

export const progressMiddleware = createListenerMiddleware();
const startAppListening = progressMiddleware.startListening as AppStartListening;

function wasSessionFinished(action: AnyAction, currentState: RootState, originalState: RootState) {
  const previousType = originalState.timer.currentSession.type;
  const currentType = currentState.timer.currentSession.type;
  return (
    previousType === PomodoroType.SESSION &&
    (currentType === PomodoroType.BREAK || currentType === PomodoroType.LONG_BREAK)
  );
}

startAppListening({
  predicate: wasSessionFinished,
  effect: (action, listenerApi) => {
    const state = listenerApi.getState().timer;
    const stored: FinishedPomodoro[] = getStoredProgressHistory();

    let newestStored = Temporal.PlainDateTime.from("1970-01-01");
    if (stored.length > 0) {
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
      listenerApi.dispatch(finishDailyGoal());
    }
  },
});
