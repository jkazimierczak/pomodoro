import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { defaultSettings, SettingsFormData } from "./schema";

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
