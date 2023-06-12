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
  const rounded = duration.round("seconds");
  let seconds = rounded.total("seconds") % 60;
  let minutes = Math.floor(rounded.total("minutes"));

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
  const nextSessionDuration = Temporal.Duration.from({ minutes: nextSession.duration });

  // Using refs to mitigate stale state within a closure
  const [readableTimeLeft, setReadableTimeLeft] = useState("");
  const [sessionStateText, setSessionStateText] = useState("Start session?");
  const [disableButtons, setdisableButtons] = useState(false);
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
    setReadableTimeLeft(readableTime(nextSessionDuration));
  }, [nextSession.duration]);

  function _stop(reducerAction: ActionCreatorWithoutPayload) {
    setTimeout(() => {
      dispatch(reducerAction());
      setReadableTimeLeft(readableTime(nextSessionDuration));
      setdisableButtons(false);
    }, 1100);
    timer.stop();

    if (reducerAction == finished && settings.canPlaySound) {
      const audio = new Audio("/sounds/complete-chime.mp3");
      audio.addEventListener("canplay", () => audio.play());
      audio.addEventListener("error", () => console.log("Audio Error"));
    }
  }

  useEffect(() => {
    const readableTimeLeft = readableTime(timer.timeLeft());
    setReadableTimeLeft(readableTimeLeft);
    const stateText = getSessionStateText() + ` | ${readableTimeLeft}`;
    document.title = stateText;

    if (timer.progress >= 1) {
      _stop(finished);
    }
  }, [timer.progress]);

  function getSessionStateText() {
    if (timerState.status === SessionStatus.UNSTARTED)
      return `Start ${nextSession.type.toLowerCase()}?`;

    let sessionText = "";
    if (currentSession.type === HistoryItemType.SESSION) {
      sessionText += "Session";
    } else {
      sessionText += "Break";
    }
    if (timerState.status === SessionStatus.RUNNING) sessionText += " ongoing";
    if (timerState.status === SessionStatus.PAUSED) sessionText += " paused";

    return sessionText;
  }

  useEffect(() => {
    const stateText = getSessionStateText();
    setSessionStateText(stateText);
    document.title = stateText;
  }, [timerState.status]);

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
    setdisableButtons(true);
    _stop(stop);
  };

  const onPauseClick = () => {
    dispatch(pause());
    timer.pause();

    setdisableButtons(true);
    setTimeout(() => setdisableButtons(false), 1100);
  };

  const onResumeClick = () => {
    dispatch(resume());
    timer.resume();
  };
  //#endregion

  return (
    <div {...props}>
      <p className="relative bottom-10 text-center text-4xl">{sessionStateText}</p>

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
            <button onClick={onStopClick} disabled={disableButtons}>
              <FiX />
            </button>
          )}
          {timerState.status === SessionStatus.RUNNING && (
            <button onClick={onPauseClick} disabled={disableButtons}>
              <FiPause />
            </button>
          )}
          {timerState.status === SessionStatus.RUNNING && (
            <button onClick={timer.addOneMinute} className={"text-3xl"}>
              +1
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
