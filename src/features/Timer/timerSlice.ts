import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

/**
 * Represents current focus session state.
 */
export enum SessionStatus {
  /**
   * Initial session state - defines a new, non-started session.
   */
  UNINITIALIZED = "UNINITIALIZED",
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
  SKIPPED = "SKIPPED",
  COMPLETED = "COMPLETED",
  UNKNOWN = "UNKNOWN",
}

export interface SessionHistoryItem {
  result: SessionResult;
}

export interface SessionDurations {
  session: number;
  break: number;
}

export interface TimerState {
  history: SessionHistoryItem[];
  currentSessionIdx: number;
  status: SessionStatus;
  duration: {
    session: number;
    break: number;
  };
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
  status: SessionStatus.UNINITIALIZED,
  duration: {
    session: 0,
    break: 0,
  },
};

export const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    initialize: (state, action: PayloadAction<SessionDurations>) => {
      state.history = [
        {
          result: SessionResult.UNKNOWN,
        },
        {
          result: SessionResult.UNKNOWN,
        },
        {
          result: SessionResult.UNKNOWN,
        },
      ];
      state.status = SessionStatus.UNSTARTED;
      state.duration.session = action.payload.session;
      state.duration.break = action.payload.break;
    },
    start: (state) => {
      state.status = SessionStatus.RUNNING;
      state.currentSessionIdx++;
    },
    skip: (state) => {
      state.status = SessionStatus.UNSTARTED;
      state.history[state.currentSessionIdx].result = SessionResult.SKIPPED;
    },
    finished: (state) => {
      state.status = SessionStatus.UNSTARTED;
      state.history[state.currentSessionIdx].result = SessionResult.COMPLETED;
    },
    stop: (state) => {
      state.status = SessionStatus.UNINITIALIZED;
      state.currentSessionIdx = -1;
    },
    pause: (state) => {
      state.status = SessionStatus.PAUSED;
    },
    resume: (state) => {
      state.status = SessionStatus.RUNNING;
    },
  },
});

export const { initialize, start, skip, stop, pause, resume, finished } = timerSlice.actions;
export default timerSlice.reducer;
