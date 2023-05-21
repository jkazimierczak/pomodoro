import { createSlice } from "@reduxjs/toolkit";
import { defaultSettings } from "./schema";

export const settingsSlice = createSlice({
  name: "settings",
  initialState: defaultSettings,
  reducers: {
    updateSettings: (state, action) => {
      return action.payload;
    },
  },
});

export const { updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
