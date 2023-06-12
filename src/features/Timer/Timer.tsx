import React, { useEffect, useMemo, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";
import { Circle } from "@/features/Timer/Circle";
import { FiCheckCircle, FiCircle, FiPause, FiPauseCircle, FiPlay, FiX } from "react-icons/fi";
import { IconContext } from "react-icons";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  finished,
  HistoryItemType,
  pause,
  resume,
  SessionStatus,
  start,
  stop,
  updateDurations,
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

  const currentSession = useAppSelector((state) => state.timer.currentSession);
  const nextSessionDuration = Temporal.Duration.from({ minutes: currentSession.duration });

  // Using refs to mitigate stale state within a closure
  const [readableTimeLeft, setReadableTimeLeft] = useState("");
  const [sessionStateText, setSessionStateText] = useState("Start session?");
  const [disableButtons, setdisableButtons] = useState(false);
  const timer = useTimer(settings.sessionDuration);

  useEffect(() => {
    dispatch(
      updateDurations({
        dailyGoal: settings.dailyGoal,
        sessionDuration: settings.sessionDuration,
        breakDuration: settings.breakDuration,
        longBreakDuration: settings.longBreakDuration,
      })
    );
  }, [
    settings.dailyGoal,
    settings.sessionDuration,
    settings.breakDuration,
    settings.longBreakDuration,
  ]);

  useEffect(() => {
    console.log(
      currentSession.duration,
      readableTime(nextSessionDuration),
      nextSessionDuration.toString()
    );
    timer.setDuration(currentSession.duration);
    setReadableTimeLeft(readableTime(nextSessionDuration));
  }, [currentSession.duration]);

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
      return `Start ${currentSession.type.toLowerCase()}?`;

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
    if (currentSession.type === HistoryItemType.SESSION) {
      sessionDuration = currentSession.duration;
    } else if (currentSession.type === HistoryItemType.BREAK) {
      sessionDuration = currentSession.duration;
    } else {
      sessionDuration = currentSession.duration;
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

  const progressCircles = useMemo(() => {
    const circles = [];

    for (let i = 0; i < timerState.history.length; i++) {
      circles.push(<FiCheckCircle />);
    }
    for (let i = timerState.history.length; i < settings.dailyGoal; i++) {
      circles.push(<FiCircle />);
    }

    if (
      timerState.status === SessionStatus.PAUSED &&
      currentSession.type === HistoryItemType.SESSION
    ) {
      circles[timerState.currentSessionIdx - 1] = <FiPauseCircle />;
    }

    return circles;
  }, [
    timerState.history.length,
    settings.dailyGoal,
    timerState.status,
    currentSession.type,
    timerState.currentSessionIdx,
  ]);

  return (
    <div {...props}>
      <p className="relative bottom-10 text-center text-4xl">{sessionStateText}</p>

      <ul
        className="absolute left-1/2 top-2.5 flex justify-center"
        style={{ transform: "translateX(-50%)" }}
      >
        {progressCircles.map((circle, idx) => (
          <IconContext.Provider
            key={`TimerState${idx}`}
            value={
              idx + idx === timerState.currentSessionIdx &&
              timerState.status !== SessionStatus.UNSTARTED &&
              currentSession.type !== HistoryItemType.BREAK
                ? { size: "1.25em" }
                : { size: "1.25em", color: "#bcbcbcc9" }
            }
          >
            {circle}
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
