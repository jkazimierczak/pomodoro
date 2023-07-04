import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { updateSettings } from "@/features/Settings";
import { AppStartListening } from "@/app";
import {
  changeNextSessionType,
  finished,
  PomodoroType,
  updateDuration,
  updateSettingsCopy,
} from "@/features/Timer";
import { LS_SETTINGS_KEY } from "@/common/localStorage/settings";

export const settingsMiddleware = createListenerMiddleware();
const startAppListening = settingsMiddleware.startListening as AppStartListening;

settingsMiddleware.startListening({
  actionCreator: updateSettings,
  effect: (action) => {
    localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(action.payload));
  },
});

startAppListening({
  actionCreator: updateSettings,
  effect: (action, api) => {
    const newSettings = action.payload;

    api.dispatch(
      updateSettingsCopy({
        dailyGoal: newSettings.dailyGoal,
        sessionsBeforeLongBreak: newSettings.sessionsBeforeLongBreak,
      })
    );
  },
});

startAppListening({
  matcher: isAnyOf(updateSettings, changeNextSessionType, finished),
  effect: (action, api) => {
    const settings = api.getState().settings;
    const sessionType = api.getState().timer.currentSession.type;

    let newSessionDuration: number;
    switch (sessionType) {
      case PomodoroType.SESSION:
        newSessionDuration = settings.sessionDuration;
        break;
      case PomodoroType.BREAK:
        newSessionDuration = settings.breakDuration;
        break;
      case PomodoroType.LONG_BREAK:
        newSessionDuration = settings.longBreakDuration;
        break;
    }

    api.dispatch(updateDuration(newSessionDuration));
  },
});
