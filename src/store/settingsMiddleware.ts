import { createListenerMiddleware } from "@reduxjs/toolkit";
import { updateSettings } from "@/features/Settings/settingsSlice";
import { defaultSettings, SettingsFormData } from "@/features/Settings/schema";

const LS_SETTINGS_KEY = "settings";

export function getStoredSettings(): SettingsFormData {
  const storedSettings = localStorage.getItem(LS_SETTINGS_KEY);
  return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
}

export const settingsMiddleware = createListenerMiddleware();

settingsMiddleware.startListening({
  actionCreator: updateSettings,
  effect: (action) => {
    localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(action.payload));
  },
});
