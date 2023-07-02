import { createListenerMiddleware } from "@reduxjs/toolkit";
import { defaultSettings, SettingsFormData, updateSettings } from "@/features/Settings";
import { updateDurations } from "@/features/Timer";
import { AppStartListening } from "@/app";

const LS_SETTINGS_KEY = "settings";

export function getStoredSettings(): SettingsFormData {
  const storedSettings = localStorage.getItem(LS_SETTINGS_KEY);
  return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
}

export const settingsMiddleware = createListenerMiddleware();
const startAppListening = settingsMiddleware.startListening as AppStartListening;

settingsMiddleware.startListening({
  actionCreator: updateSettings,
  effect: (action) => {
    localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(action.payload));
  },
});

startAppListening({
  actionCreator: updateSettings,
  effect: (action, api) => {
    const settings = action.payload;

    api.dispatch(
      updateDurations({
        dailyGoal: settings.dailyGoal,
        sessionDuration: settings.sessionDuration,
        breakDuration: settings.breakDuration,
        longBreakDuration: settings.longBreakDuration,
        sessionsBeforeLongBreak: settings.sessionsBeforeLongBreak,
      })
    );
  },
});
