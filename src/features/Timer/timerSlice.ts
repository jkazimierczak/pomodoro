import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

/**
 * Represents current focus session state.
 */
export enum SessionStatus {
  /**
   * Initial session state - defines a new, non-started session.
   */
  UNSTARTED = "UNSTARTED",
  /**
   * Running - as in started - session state.
   */
  RUNNING = "RUNNING",
  /**
   * Paused session state.
   */
  PAUSED = "PAUSED",
  /**
   * Finished session state.
   */
  FINISHED = "FINISHED",
}

/**
 * Represents session type.
 */
export enum SessionType {
  BREAK = "BREAK",
  FOCUS = "FOCUS",
}

export enum SessionResult {
  COMPLETED = "COMPLETED",
  UNKNOWN = "UNKNOWN",
}

export interface SessionHistoryItem {
  result: SessionResult;
}

export interface TimerState {
  history: SessionHistoryItem[];
  currentSessionIdx: number;
  status: SessionStatus;
  // temporal: {
  //   duration: Temporal.Duration;
  //   start: Temporal.PlainTime;
  //   end: Temporal.PlainTime;
  //   timeLeft: Temporal.Duration;
  // };
}

const initialState: TimerState = {
  history: [],
  currentSessionIdx: -1,
  status: SessionStatus.UNSTARTED,
};

export const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    initialize: (state, action: PayloadAction<number>) => {
      const { payload } = action;

      const historyLenDiff = payload - state.history.length;
      console.log("diff", historyLenDiff);
      if (historyLenDiff > 0) {
        for (let i = state.history.length; i < payload; i++) {
          state.history.push({
            result: SessionResult.UNKNOWN,
          });
        }
      } else if (historyLenDiff < 0) {
        for (let i = 0; i < -historyLenDiff; i++) {
          state.history.pop();
        }
      }
      state.status = SessionStatus.UNSTARTED;
    },
    start: (state) => {
      state.status = SessionStatus.RUNNING;
      state.currentSessionIdx++;
    },
    finished: (state) => {
      state.status = SessionStatus.UNSTARTED;
      state.history[state.currentSessionIdx].result = SessionResult.COMPLETED;
    },
    stop: (state) => {
      state.status = SessionStatus.UNSTARTED;
      state.currentSessionIdx--;
    },
    pause: (state) => {
      state.status = SessionStatus.PAUSED;
    },
    resume: (state) => {
      state.status = SessionStatus.RUNNING;
    },
  },
});

export const { initialize, start,, stop, pause, resume, finished } = timerSlice.actions;
export default timerSlice.reducer;
