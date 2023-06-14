import { PomodoroType } from "@/features/Timer/timerSlice";
import { AnyAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";

export function wasSessionFinished(
  action: AnyAction,
  currentState: RootState,
  originalState: RootState
) {
  const previousType = originalState.timer.currentSession.type;
  const currentType = currentState.timer.currentSession.type;
  return (
    previousType === PomodoroType.SESSION &&
    (currentType === PomodoroType.BREAK || currentType === PomodoroType.LONG_BREAK)
  );
}
