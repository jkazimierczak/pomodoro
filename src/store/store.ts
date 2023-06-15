import { configureStore, TypedStartListening } from "@reduxjs/toolkit";
import timerReducer, { initialTimerState as initialTimerState } from "@/features/Timer/timerSlice";
import settingsReducer from "@/features/Settings/settingsSlice";
import appReducer, { initialAppState } from "@/appSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { getStoredSettings, settingsMiddleware } from "@/store/settingsMiddleware";
import {
  getStoredProgressHistorySince,
  progressMiddleware,
} from "@/store/progressHistoryMiddleware";
import { defaultSettings } from "@/features/Settings/schema";
import { getStoredNextMidnight, nightOwlMiddleware } from "@/store/nightOwlMiddleware";
import { getNextMidnightFromString } from "@/store/helpers";

const preloadedSettings = getStoredSettings();
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
    settings: {
      ...defaultSettings,
      ...preloadedSettings,
    },
    timer: {
      ...initialTimerState,
      history: preloadedProgressHistory,
      currentSessionIdx: preloadedProgressHistory.length % preloadedSettings.dailyGoal,
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
