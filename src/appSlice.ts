import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Temporal } from "@js-temporal/polyfill";
import { getNextMidnight } from "@/store/nightOwlMiddleware";

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
    setNextMidnight: (state, action: PayloadAction<Temporal.PlainDateTime>) => {
      state.nextMidnight = action.payload.toString();
    },
  },
});

export const { setNextMidnight } = appSlice.actions;
export default appSlice.reducer;
