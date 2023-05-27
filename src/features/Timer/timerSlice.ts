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
export enum HistoryItemType {
  BREAK = "BREAK",
  SESSION = "SESSION",
  LONG_BREAK = "LONG_BREAK",
}

export enum SessionResult {
  COMPLETED = "COMPLETED",
  UNKNOWN = "UNKNOWN",
}

export interface SessionHistoryItem {
  type: HistoryItemType;
  result: SessionResult;
  duration?: number;
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

interface InitializeActionPayload {
  sessionCount: number;
  sessionDuration: number;
  breakDuration: number;
  longBreakDuration: number;
}

export const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    initialize: (state, action: PayloadAction<InitializeActionPayload>) => {
      const { payload } = action;

      const desiredLength = payload.sessionCount + payload.sessionCount;
      const historyLenDiff = desiredLength - state.history.length;

      if (historyLenDiff == 0) {
        state.history.forEach((item) => {
          if (item.type === HistoryItemType.SESSION) {
            item.duration = payload.sessionDuration;
          } else if (item.type === HistoryItemType.BREAK) {
            item.duration = payload.breakDuration;
          } else {
            item.duration = payload.longBreakDuration;
          }
        });
      }

      if (historyLenDiff > 0) {
        for (let i = state.history.length; i < desiredLength; i++) {
          if (i % 2 == 0) {
            // Session item
            state.history.push({
              type: HistoryItemType.SESSION,
              result: SessionResult.UNKNOWN,
              duration: payload.sessionDuration,
            });
          } else {
            // Break item
            state.history.push({
              type: HistoryItemType.BREAK,
              result: SessionResult.UNKNOWN,
              duration: payload.breakDuration,
            });
          }
        }
      } else if (historyLenDiff < 0) {
        for (let i = 0; i < -historyLenDiff; i++) {
          state.history.pop();
        }
      }

      state.status = SessionStatus.UNSTARTED;
    },
    setLongBreakAfter: (state, action: PayloadAction<number>) => {
      const item = state.history[action.payload + 1];
      item.type = HistoryItemType.LONG_BREAK;
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

export const { initialize, start, stop, pause, resume, finished } = timerSlice.actions;
export default timerSlice.reducer;
