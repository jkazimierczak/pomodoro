import { createListenerMiddleware } from "@reduxjs/toolkit";
import { AppStartListening } from "@/store/store";
import { Temporal } from "@js-temporal/polyfill";
import { setNextMidnight } from "@/appSlice";
import { finished } from "@/features/Timer/timerSlice";
import { getNextMidnight } from "@/store/helpers";

const LS_NEXT_MIDNIGHT_KEY = "next_midnight";

/**
 * Compute next offset midnight.
 * @param time Temporal.PlainTime compatible time string.
 */
export function getNextMidnightFromString(time: string) {
  console.log(time);
  const _time = Temporal.PlainTime.from(time);
  return getNextMidnight(_time.hour, _time.minute);
}

/**
 * Compute next offset midnight.
 * @param offsetHours A number of hours to offset by.
 * @param offsetMinutes (optional) A number of minutes to offset by.
 */
export function getNextMidnight(offsetHours: number, offsetMinutes?: number) {
  return Temporal.Now.plainDateTime("gregory")
    .round({ smallestUnit: "day", roundingMode: "trunc" })
    .add({ days: 1, hours: offsetHours, minutes: offsetMinutes ?? 0 });
}

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
    const offset = Temporal.PlainTime.from(state.settings.startNewDayAt);

    const now = Temporal.Now.plainDateTime("gregory");
    if (Temporal.PlainDateTime.compare(nextMidnight, now) < 0) {
      const nextMidnight = getNextMidnight(offset.hour, offset.minute);

      listenerApi.dispatch(setNextMidnight(nextMidnight));
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
