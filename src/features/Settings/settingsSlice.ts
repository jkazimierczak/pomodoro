import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { SettingsFormData } from "./schema";

export const defaultSettings: SettingsFormData = {
  sessionDuration: 25,
  breakDuration: 5,
  longBreakDuration: 20,
  sessionsBeforeLongBreak: 4,
  dailyGoal: 8,
  canPlaySound: true,
  autoStartBreaks: true,
  autoStartSessions: false,
  startNewDayAt: "04:00",
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState: defaultSettings,
  reducers: {
    updateSettings: (state, action: PayloadAction<SettingsFormData>) => {
      return action.payload;
    },
  },
});

export const { updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
