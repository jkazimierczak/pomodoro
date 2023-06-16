import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getNextMidnight } from "@/store/helpers";

interface AppState {
  finishedDailyGoal: boolean;
  nextMidnight: string;
}

export const initialAppState: AppState = {
  finishedDailyGoal: false,
  nextMidnight: getNextMidnight(4).toString(),
};

export const appSlice = createSlice({
  name: "app",
  initialState: initialAppState,
  reducers: {
    setNextMidnight: (state, action: PayloadAction<string>) => {
      state.nextMidnight = action.payload;
    },
    finishDailyGoal: (state) => {
      state.finishedDailyGoal = true;
    },
    resetDailyGoal: (state) => {
      state.finishedDailyGoal = false;
    },
  },
});

export const { setNextMidnight, finishDailyGoal, resetDailyGoal } = appSlice.actions;
export default appSlice.reducer;
