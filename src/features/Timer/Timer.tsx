import React, { useEffect, useRef, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";
import { Circle } from "@/features/Timer/Circle";
import { FiCheckCircle, FiCircle, FiPause, FiPauseCircle, FiPlay, FiX } from "react-icons/fi";
import { IconContext } from "react-icons";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  finished,
  HistoryItemType,
  initialize,
  pause,
  resume,
  SessionResult,
  SessionStatus,
  start,
  stop,
} from "@/features/Timer/timerSlice";
import { useTimer } from "@/features/Timer/useTimer";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";

interface ITimerProps extends React.ComponentProps<"div"> {}

/**
 * Return MM:SS formatted string from duration.
 * @param duration A Temporal.Duration instance.
 */
function readableTime(duration: Temporal.Duration): string {
  let seconds = duration.round("seconds").total("seconds") % 60;
  let minutes = Math.floor(duration.total("minutes"));

  if (minutes < 0) minutes = 0;
  if (seconds < 0) seconds = 0;

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function Timer({ ...props }: ITimerProps) {
  const dispatch = useAppDispatch();
  const timerState = useAppSelector((state) => state.timer);
  const settings = useAppSelector((state) => state.settings);
  const currentSession = useAppSelector(
    (state) => state.timer.history[state.timer.currentSessionIdx]
  );
  const nextSession = useAppSelector(
    (state) => state.timer.history[state.timer.currentSessionIdx + 1]
  );

  // Using refs to mitigate stale state within a closure
  const [readableTimeLeft, setReadableTimeLeft] = useState("");
  const timer = useTimer(settings.sessionDuration);

  function updateTimerSettings() {
    const common = {
      sessionDuration: settings.sessionDuration,
      breakDuration: settings.breakDuration,
      longBreakDuration: settings.longBreakDuration,
    };

    dispatch(
      initialize({
        ...common,
        sessionCount: settings.dailyGoal,
      })
    );
  }

  useEffect(updateTimerSettings, [
    settings.dailyGoal,
    settings.sessionDuration,
    settings.breakDuration,
    settings.longBreakDuration,
  ]);

  useEffect(() => {
    timer.setDuration(nextSession.duration);
    setReadableTimeLeft(readableTime(Temporal.Duration.from({ minutes: nextSession.duration })));
  }, [nextSession.duration]);

  function _stop(reducerAction: ActionCreatorWithoutPayload) {
    setTimeout(() => dispatch(reducerAction()), 1100);
    timer.stop();
  }

  useEffect(() => {
    setReadableTimeLeft(readableTime(timer.timeLeft()));

    if (timer.progress >= 1) {
      _stop(finished);
    }
  }, [timer.progress]);

  //#region EventHandlers
  const onStartClick = () => {
    let sessionDuration;
    if (nextSession.type === HistoryItemType.SESSION) {
      sessionDuration = nextSession.duration;
    } else if (nextSession.type === HistoryItemType.BREAK) {
      sessionDuration = nextSession.duration;
    } else {
      sessionDuration = nextSession.duration;
    }

    dispatch(start());
    timer.start(sessionDuration);
  };

  const onStopClick = () => {
    _stop(stop);
  };

  const onPauseClick = () => {
    dispatch(pause());
    timer.pause();
  };

  const onResumeClick = () => {
    dispatch(resume());
    timer.resume();
  };
  //#endregion

  return (
    <div {...props}>
      <p className="relative bottom-10 text-center text-4xl">
        {timerState.history.length && (
          <>
            {timerState.status === SessionStatus.UNSTARTED &&
              `Start ${nextSession.type.toLowerCase()}?`}
            {timerState.status !== SessionStatus.UNSTARTED &&
              (currentSession.type === HistoryItemType.SESSION ? "Session " : "Break ")}
            {timerState.status === SessionStatus.RUNNING && "ongoing"}
            {timerState.status === SessionStatus.PAUSED && "paused"}
          </>
        )}
      </p>

      <ul
        className="absolute left-1/2 top-2.5 flex justify-center"
        style={{ transform: "translateX(-50%)" }}
      >
        {timerState.history
          .filter((item) => item.type === HistoryItemType.SESSION)
          .map((item, idx) => (
            <IconContext.Provider
              key={`TimerState${idx}`}
              value={
                idx + idx === timerState.currentSessionIdx &&
                timerState.status !== SessionStatus.UNSTARTED
                  ? { size: "1.25em" }
                  : { size: "1.25em", color: "#bcbcbcc9" }
              }
            >
              <li>
                {item.result === SessionResult.COMPLETED ? (
                  <FiCheckCircle />
                ) : timerState.status === SessionStatus.PAUSED &&
                  idx + idx === timerState.currentSessionIdx ? (
                  <FiPauseCircle />
                ) : (
                  <FiCircle />
                )}
              </li>
            </IconContext.Provider>
          ))}
      </ul>

      <Circle
        showProgress={
          timerState.status === SessionStatus.RUNNING || timerState.status === SessionStatus.PAUSED
        }
        progress={timer.progress}
        timeRemaining={readableTimeLeft}
      />
      <div className="relative top-10 flex justify-center gap-6">
        <IconContext.Provider value={{ size: "2.25em" }}>
          {timerState.status === SessionStatus.UNSTARTED && (
            <button onClick={onStartClick}>
              <FiPlay />
            </button>
          )}
          {[SessionStatus.RUNNING, SessionStatus.PAUSED].includes(timerState.status) && (
            <button onClick={onStopClick}>
              <FiX />
            </button>
          )}
          {timerState.status === SessionStatus.RUNNING && (
            <button onClick={onPauseClick}>
              <FiPause />
            </button>
          )}
          {timerState.status === SessionStatus.PAUSED && (
            <button onClick={onResumeClick}>
              <FiPlay />
            </button>
          )}
        </IconContext.Provider>
      </div>
    </div>
  );
}
