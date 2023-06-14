import { configureStore, TypedStartListening } from "@reduxjs/toolkit";
import timerReducer, { initialState as initialTimerState } from "@/features/Timer/timerSlice";
import settingsReducer from "@/features/Settings/settingsSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { getStoredSettings, settingsMiddleware } from "@/store/settingsMiddleware";
import { getStoredProgressHistory, progressMiddleware } from "@/store/progressHistoryMiddleware";
import { defaultSettings } from "@/features/Settings/schema";

const preloadedSettings = getStoredSettings();
const preloadedProgressHistory = getStoredProgressHistory();

export const store = configureStore({
  preloadedState: {
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
    timer: timerReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(progressMiddleware.middleware)
      .concat(settingsMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStartListening = TypedStartListening<RootState, AppDispatch>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
