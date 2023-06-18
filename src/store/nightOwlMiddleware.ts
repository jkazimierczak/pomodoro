import { createListenerMiddleware } from "@reduxjs/toolkit";
import { AppStartListening } from "@/store/store";
import { Temporal } from "@js-temporal/polyfill";
import { setNextMidnight } from "@/appSlice";
import { finished, resetProgress } from "@/features/Timer/timerSlice";
import { getNextMidnight } from "@/store/helpers";

const LS_NEXT_MIDNIGHT_KEY = "next_midnight";

export function getStoredNextMidnight(): string | null {
  const stored = localStorage.getItem(LS_NEXT_MIDNIGHT_KEY);
  return stored ? stored : null;
}

export const nightOwlMiddleware = createListenerMiddleware();
export const startAppListening = nightOwlMiddleware.startListening as AppStartListening;

startAppListening({
  actionCreator: finished,
  effect: (action, listenerApi) => {
    const state = listenerApi.getState();

    const nextMidnight = Temporal.PlainDateTime.from(state.app.nextMidnight);
    const now = Temporal.Now.plainDateTime("gregory");

    if (Temporal.PlainDateTime.compare(nextMidnight, now) < 0) {
      const offset = Temporal.PlainTime.from(state.settings.startNewDayAt);
      const nextMidnight = getNextMidnight(offset.hour, offset.minute);

      listenerApi.dispatch(setNextMidnight(nextMidnight));
      listenerApi.dispatch(resetProgress());
    }
  },
});

startAppListening({
  actionCreator: setNextMidnight,
  effect: (action, listenerApi) => {
    console.log("saved");
    const state = listenerApi.getState();
    const nextMidnight = Temporal.PlainDateTime.from(state.app.nextMidnight);

    localStorage.setItem(LS_NEXT_MIDNIGHT_KEY, nextMidnight.toString());
  },
});
