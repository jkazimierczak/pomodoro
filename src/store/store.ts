import { configureStore } from "@reduxjs/toolkit";
import timerReducer from "@/features/Timer/timerSlice";
import settingsReducer from "@/features/Settings/settingsSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { getStoredSettings, settingsMiddleware } from "@/store/settingsMiddleware";

export const store = configureStore({
  preloadedState: {
    settings: getStoredSettings(),
  },
  reducer: {
    timer: timerReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(settingsMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
