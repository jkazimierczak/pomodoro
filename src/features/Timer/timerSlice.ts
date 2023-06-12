import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { defaultSettings } from "@/features/Settings/schema";
import { Temporal } from "@js-temporal/polyfill";

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
  duration: number;
  finishedAt: string;
}

export interface Session {
  type: HistoryItemType;
  duration: number;
  result: SessionResult;
}

export interface TimerState {
  currentSession: Session;
  nextSession: Session;
  currentSessionIdx: number;
  status: SessionStatus;
  history: SessionHistoryItem[];
  durations: InitializeActionPayload;
}

const initialState: TimerState = {
  currentSession: {
    type: HistoryItemType.SESSION,
    duration: defaultSettings.sessionDuration,
    result: SessionResult.UNKNOWN,
  },
  nextSession: {
    type: HistoryItemType.BREAK,
    duration: defaultSettings.breakDuration,
    result: SessionResult.UNKNOWN,
  },
  history: [],
  currentSessionIdx: 0,
  durations: {
    ...defaultSettings,
  },
  status: SessionStatus.UNSTARTED,
};

interface InitializeActionPayload {
  dailyGoal: number;
  sessionDuration: number;
  breakDuration: number;
  longBreakDuration: number;
}

export const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    updateDurations: (state, action: PayloadAction<InitializeActionPayload>) => {
      state.durations = { ...action.payload };

      const key = state.currentSession.type.toLowerCase();
      state.currentSession.duration = action.payload[`${key}Duration`];
    },
    start: (state) => {
      state.status = SessionStatus.RUNNING;
      state.currentSessionIdx++;
    },
    finished: (state) => {
      state.status = SessionStatus.UNSTARTED;
      state.currentSession.result = SessionResult.COMPLETED;

      // Save finished session to a history
      if (state.currentSession.type === HistoryItemType.SESSION) {
        state.history.push({
          duration: state.currentSession.duration,
          finishedAt: Temporal.Now.plainDateTimeISO().toString(),
        });
      }

      // Bootstrap new session
      const finishedSession = state.currentSession.type === HistoryItemType.SESSION;
      if (finishedSession) {
        state.nextSession = {
          type: HistoryItemType.BREAK,
          duration: state.durations.breakDuration,
          result: SessionResult.UNKNOWN,
        };
      } else {
        state.nextSession = {
          type: HistoryItemType.SESSION,
          duration: state.durations.sessionDuration,
          result: SessionResult.UNKNOWN,
        };
      }
      state.currentSession = { ...state.nextSession };
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

export const { updateDurations, start, stop, pause, resume, finished } = timerSlice.actions;
export default timerSlice.reducer;
