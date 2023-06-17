import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { configureStore, TypedStartListening } from "@reduxjs/toolkit";
import appReducer, { initialAppState } from "@/app/appSlice";
import { initialTimerState, timerReducer } from "@/features/Timer";
import { defaultSettings } from "@/features/Settings/schema";
import { getStoredSettings, settingsMiddleware } from "@/store/settingsMiddleware";
import {
  getStoredProgressHistorySince,
  progressMiddleware,
} from "@/store/progressHistoryMiddleware";
import { getStoredNextMidnight, nightOwlMiddleware } from "@/store/nightOwlMiddleware";
import { getNextMidnightFromString } from "@/common/helpers";
import { settingsReducer } from "@/features/Settings";

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
