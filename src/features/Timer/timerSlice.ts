import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { Temporal } from "@js-temporal/polyfill";
import { defaultSettings } from "@/features/Settings";

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
  LONG_BREAK = "LONG BREAK",
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
  settings: TimerSettings;
}

export const initialTimerState: TimerState = {
  currentSession: {
    type: PomodoroType.SESSION,
    duration: defaultSettings.sessionDuration,
  },
  history: [],
  currentSessionIdx: 0,
  settings: {
    dailyGoal: defaultSettings.dailyGoal,
    sessionsBeforeLongBreak: defaultSettings.sessionsBeforeLongBreak,
  },
  status: PomodoroStatus.UNSTARTED,
};

interface TimerSettings {
  dailyGoal: number;
  sessionsBeforeLongBreak: number;
}

export const timerSlice = createSlice({
  name: "timer",
  initialState: initialTimerState,
  reducers: {
    updateDuration: (state, action: PayloadAction<number>) => {
      state.currentSession.duration = action.payload;
    },
    updateSettingsCopy: (state, action: PayloadAction<TimerSettings>) => {
      state.settings = { ...action.payload };
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
      let nextSessionType: PomodoroType;
      const finishedSession = state.currentSession.type === PomodoroType.SESSION;
      if (finishedSession) {
        if (state.currentSessionIdx % state.settings.sessionsBeforeLongBreak === 0) {
          nextSessionType = PomodoroType.LONG_BREAK;
        } else {
          nextSessionType = PomodoroType.BREAK;
        }
      } else {
        nextSessionType = PomodoroType.SESSION;
      }
      state.currentSession.type = nextSessionType;
    },
    resetProgress: (state) => {
      state.currentSessionIdx = 0;
      state.history = [];
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
    changeNextSessionType: (state) => {
      if ([PomodoroStatus.RUNNING, PomodoroStatus.PAUSED].includes(state.status)) return;

      switch (state.currentSession.type) {
        case PomodoroType.SESSION:
          state.currentSession.type = PomodoroType.BREAK;
          break;
        case PomodoroType.BREAK:
          state.currentSession.type = PomodoroType.LONG_BREAK;
          break;
        case PomodoroType.LONG_BREAK:
          state.currentSession.type = PomodoroType.SESSION;
          break;
      }
    },
  },
});

export const {
  updateDuration,
  updateSettingsCopy,
  resetProgress,
  start,
  stop,
  pause,
  resume,
  finished,
  changeNextSessionType,
} = timerSlice.actions;
export default timerSlice.reducer;
