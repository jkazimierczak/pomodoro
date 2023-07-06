import { configureStore, TypedStartListening } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import appReducer, { initialAppState } from "@/app/appSlice";
import { getNextMidnightFromString } from "@/common/helpers";
import { defaultSettings,settingsReducer } from "@/features/Settings";
import { initialTimerState, timerReducer } from "@/features/Timer";
import {
  getStoredNextMidnight,
  getStoredProgressHistorySince,
  getStoredSettings,
  nightOwlMiddleware,
  progressMiddleware,
  settingsMiddleware,
} from "@/store";

const preloadedSettings = {
  ...defaultSettings,
  ...getStoredSettings(),
};
const preloadedNextMidnight =
  getStoredNextMidnight() ?? getNextMidnightFromString(preloadedSettings.startNewDayAt);
const preloadedProgressHistory = getStoredProgressHistorySince(
  preloadedNextMidnight.subtract({ days: 1 })
);

export const store = configureStore({
  preloadedState: {
    app: {
      ...initialAppState,
      nextMidnight: preloadedNextMidnight.toString(),
    },
    settings: preloadedSettings,
    timer: {
      ...initialTimerState,
      history: preloadedProgressHistory,
      currentSessionIdx: preloadedProgressHistory.length % preloadedSettings.dailyGoal,
      currentSession: {
        ...initialTimerState.currentSession,
        duration: preloadedSettings.sessionDuration,
      },
      settings: {
        dailyGoal: preloadedSettings.dailyGoal,
        sessionsBeforeLongBreak: preloadedSettings.sessionsBeforeLongBreak,
      },
    },
  },
  reducer: {
    app: appReducer,
    timer: timerReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(nightOwlMiddleware.middleware)
      .concat(progressMiddleware.middleware)
      .concat(settingsMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStartListening = TypedStartListening<RootState, AppDispatch>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
