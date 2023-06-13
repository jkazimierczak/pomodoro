import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, current } from "@reduxjs/toolkit";
import { defaultSettings } from "@/features/Settings/schema";
import { Temporal } from "@js-temporal/polyfill";

/**
 * Represents current pomodoro session state.
 */
export enum PomodoroStatus {
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
}

/**
 * Represents pomodoro session type.
 */
export enum PomodoroType {
  BREAK = "BREAK",
  SESSION = "SESSION",
  LONG_BREAK = "LONG_BREAK",
}

/**
 * Represents a single pomodoro session.
 */
export interface PomodoroSession {
  type: PomodoroType;
  duration: number;
}

/**
 * Represents already finished pomodoro session.
 */
export interface FinishedPomodoro {
  duration: number;
  finishedAt: string;
}

export interface TimerState {
  currentSession: PomodoroSession;
  currentSessionIdx: number;
  status: PomodoroStatus;
  history: FinishedPomodoro[];
  durations: InitializeActionPayload;
}

const initialState: TimerState = {
  currentSession: {
    type: PomodoroType.SESSION,
    duration: defaultSettings.sessionDuration,
  },
  history: [],
  currentSessionIdx: 0,
  durations: {
    ...defaultSettings,
  },
  status: PomodoroStatus.UNSTARTED,
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
      const durations = action.payload;
      state.durations = { ...durations };

      const currentSession = state.currentSession;
      switch (state.currentSession.type) {
        case PomodoroType.SESSION:
          currentSession.duration = durations.sessionDuration;
          break;
        case PomodoroType.BREAK:
          currentSession.duration = durations.breakDuration;
          break;
        case PomodoroType.LONG_BREAK:
          currentSession.duration = durations.longBreakDuration;
          break;
      }
    },
    start: (state) => {
      state.status = PomodoroStatus.RUNNING;
    },
    finished: (state) => {
      state.status = PomodoroStatus.UNSTARTED;
      if (state.currentSession.type === PomodoroType.SESSION) {
        state.currentSessionIdx++;
      }

      // Save finished session to a history
      if (state.currentSession.type === PomodoroType.SESSION) {
        state.history.push({
          duration: state.currentSession.duration,
          finishedAt: Temporal.Now.plainDateTimeISO().toString(),
        });
      }

      // Bootstrap new session
      const finishedSession = state.currentSession.type === PomodoroType.SESSION;
      if (finishedSession) {
        state.currentSession = {
          type: PomodoroType.BREAK,
          duration: state.durations.breakDuration,
        };
      } else {
        state.currentSession = {
          type: PomodoroType.SESSION,
          duration: state.durations.sessionDuration,
        };
      }
    },
    stop: (state) => {
      state.status = PomodoroStatus.UNSTARTED;
    },
    pause: (state) => {
      state.status = PomodoroStatus.PAUSED;
    },
    resume: (state) => {
      state.status = PomodoroStatus.RUNNING;
    },
  },
});

export const { updateDurations, start, stop, pause, resume, finished } = timerSlice.actions;
export default timerSlice.reducer;
