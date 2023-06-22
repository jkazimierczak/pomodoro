import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getNextMidnight } from "@/store/helpers";

interface AppState {
  nextMidnight: string;
}

export const initialAppState: AppState = {
  nextMidnight: getNextMidnight(4).toString(),
};

export const appSlice = createSlice({
  name: "app",
  initialState: initialAppState,
  reducers: {
    setNextMidnight: (state, action: PayloadAction<string>) => {
      state.nextMidnight = action.payload;
    },
  },
});

export const { setNextMidnight } = appSlice.actions;
export default appSlice.reducer;
