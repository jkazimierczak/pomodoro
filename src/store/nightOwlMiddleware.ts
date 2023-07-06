import { Temporal } from "@js-temporal/polyfill";
import { AnyAction, createListenerMiddleware, isAnyOf, ListenerEffectAPI } from "@reduxjs/toolkit";

import { AppDispatch, AppStartListening, RootState, setNextMidnight } from "@/app";
import { getNextMidnight } from "@/common/helpers";
import { updateSettings } from "@/features/Settings/settingsSlice";
import { finished, resetProgress, start } from "@/features/Timer/timerSlice";

const LS_NEXT_MIDNIGHT_KEY = "next_midnight";

export function getStoredNextMidnight(): Temporal.PlainDateTime | null {
  const stored = localStorage.getItem(LS_NEXT_MIDNIGHT_KEY);
  return stored ? Temporal.PlainDateTime.from(stored) : null;
}

export const nightOwlMiddleware = createListenerMiddleware();
const startAppListening = nightOwlMiddleware.startListening as AppStartListening;

/**
 * Try to update the next midnight if the current one is out of date.
 * If the current one is up-to-date nothing is changed.
 */
function tryUpdateNextMidnight(
  action: AnyAction,
  listenerApi: ListenerEffectAPI<RootState, AppDispatch>
) {
  const state = listenerApi.getState();

  const nextMidnight = Temporal.PlainDateTime.from(state.app.nextMidnight);
  const now = Temporal.Now.plainDateTime("gregory");

  if (Temporal.PlainDateTime.compare(nextMidnight, now) < 0) {
    const offset = Temporal.PlainTime.from(state.settings.startNewDayAt);
    const nextMidnight = getNextMidnight(offset.hour, offset.minute);

    listenerApi.dispatch(setNextMidnight(nextMidnight.toString()));
    listenerApi.dispatch(resetProgress());
  }
}

/**
 * Ensure that the next midnight is up-to-date at start-up.
 * That is, the current date < next midnight.
 */
startAppListening({
  predicate: () => true,
  effect: (action, listenerApi) => {
    tryUpdateNextMidnight(action, listenerApi);
    listenerApi.unsubscribe();
  },
});

/**
 * Ensure that the next midnight is up-to-date at runtime.
 * That is, the current date < next midnight.
 */
startAppListening({
  matcher: isAnyOf(start, finished, updateSettings),
  effect: tryUpdateNextMidnight,
});

/**
 * Save the next midnight into the local storage.
 */
startAppListening({
  actionCreator: setNextMidnight,
  effect: (action, listenerApi) => {
    const state = listenerApi.getState();
    const nextMidnight = Temporal.PlainDateTime.from(state.app.nextMidnight);

    localStorage.setItem(LS_NEXT_MIDNIGHT_KEY, nextMidnight.toString());
  },
});
