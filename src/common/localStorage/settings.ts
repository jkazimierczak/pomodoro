import { defaultSettings, SettingsFormData } from "@/features/Settings";

export const LS_SETTINGS_KEY = "settings";

export function getStoredSettings(): SettingsFormData {
  const storedSettings = localStorage.getItem(LS_SETTINGS_KEY);
  return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
}
