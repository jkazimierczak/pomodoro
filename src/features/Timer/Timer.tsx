import React, { useEffect, useMemo, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";
import { Circle } from "./Circle";
import {
  FiCheckCircle,
  FiCircle,
  FiCode,
  FiPause,
  FiPauseCircle,
  FiPlay,
  FiX,
} from "react-icons/fi";
import { IconContext } from "react-icons";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  changeNextSessionType,
  finished,
  pause,
  PomodoroStatus,
  PomodoroType,
  resume,
  start,
  stop,
  updateDurations,
} from "./timerSlice";
import { useTimer } from "./useTimer";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { readableTime } from "./helpers";

interface ITimerProps extends React.ComponentProps<"div"> {}

export function Timer({ ...props }: ITimerProps) {
  const dispatch = useAppDispatch();
  const timerState = useAppSelector((state) => state.timer);
  const settings = useAppSelector((state) => state.settings);

  const currentSession = useAppSelector((state) => state.timer.currentSession);
  const nextSessionDuration = Temporal.Duration.from({ minutes: currentSession.duration });

  // Using refs to mitigate stale state within a closure
  const [readableTimeLeft, setReadableTimeLeft] = useState("");
  const [sessionStateText, setSessionStateText] = useState("Start session?");
  const [disableButtons, setDisableButtons] = useState(false);
  const timer = useTimer(settings.sessionDuration);

  useEffect(() => {
    dispatch(
      updateDurations({
        dailyGoal: settings.dailyGoal,
        sessionDuration: settings.sessionDuration,
        breakDuration: settings.breakDuration,
        longBreakDuration: settings.longBreakDuration,
        sessionsBeforeLongBreak: settings.sessionsBeforeLongBreak,
      })
    );
  }, [
    settings.dailyGoal,
    settings.sessionDuration,
    settings.breakDuration,
    settings.longBreakDuration,
  ]);

  useEffect(() => {
    timer.setDuration(currentSession.duration);
    setReadableTimeLeft(readableTime(nextSessionDuration));
  }, [currentSession.duration]);

  function _stop(reducerAction: ActionCreatorWithoutPayload) {
    setTimeout(() => {
      dispatch(reducerAction());
      setReadableTimeLeft(readableTime(nextSessionDuration));
      setDisableButtons(false);
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
    const stateText = `${readableTimeLeft} | ${getSessionStateText()}`;
    document.title = stateText;

    if (timer.progress >= 1) {
      _stop(finished);
    }
  }, [timer.progress]);

  function getSessionStateText() {
    if (timerState.status === PomodoroStatus.UNSTARTED)
      return `Start ${currentSession.type.toLowerCase()}?`;

    let sessionText = "";
    if (currentSession.type === PomodoroType.SESSION) {
      sessionText += "Session";
    } else {
      sessionText += "Break";
    }
    if (timerState.status === PomodoroStatus.RUNNING) sessionText += " ongoing";
    if (timerState.status === PomodoroStatus.PAUSED) sessionText += " paused";

    return sessionText;
  }

  useEffect(() => {
    const stateText = getSessionStateText();
    setSessionStateText(stateText);
    document.title = stateText;
  }, [timerState.status, timerState.currentSession.type]);

  //#region EventHandlers
  const onStartClick = () => {
    dispatch(start());
    timer.start(currentSession.duration);
  };

  const onStopClick = () => {
    setDisableButtons(true);
    _stop(stop);
  };

  const onPauseClick = () => {
    dispatch(pause());
    timer.pause();

    setDisableButtons(true);
    setTimeout(() => setDisableButtons(false), 1100);
  };

  const onResumeClick = () => {
    dispatch(resume());
    timer.resume();
  };

  function toggleNextSessionType() {
    dispatch(changeNextSessionType());
  }
  //#endregion

  const progressCircles = useMemo(() => {
    const circles = [];

    const historyLenMod = timerState.history.length % settings.dailyGoal;
    for (let i = 0; i < historyLenMod; i++) {
      circles.push(<FiCheckCircle />);
    }
    for (let i = historyLenMod; i < settings.dailyGoal; i++) {
      circles.push(<FiCircle />);
    }

    if (
      timerState.status === PomodoroStatus.PAUSED &&
      currentSession.type === PomodoroType.SESSION
    ) {
      circles[timerState.currentSessionIdx] = <FiPauseCircle />;
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
      <span
        className="relative bottom-10 flex items-center justify-center gap-2 hover:cursor-pointer"
        onClick={toggleNextSessionType}
      >
        <p className="select-none text-center text-4xl">{sessionStateText}</p>
        {timerState.status === PomodoroStatus.UNSTARTED && (
          <span className="rotate-90">
            <FiCode />
          </span>
        )}
      </span>

      <ul
        className="absolute left-1/2 top-2.5 flex justify-center"
        style={{ transform: "translateX(-50%)" }}
      >
        {progressCircles.map((circle, idx) => (
          <IconContext.Provider
            key={`TimerState${idx}`}
            value={
              idx === timerState.currentSessionIdx &&
              timerState.status !== PomodoroStatus.UNSTARTED &&
              currentSession.type === PomodoroType.SESSION
                ? { size: "1.25em" }
                : { size: "1.25em", color: "#bcbcbcc9" }
            }
          >
            <>
              {idx !== 0 && idx % settings.sessionsBeforeLongBreak === 0 && (
                <span className={"mx-1 block"} />
              )}
              {circle}
            </>
          </IconContext.Provider>
        ))}
      </ul>

      <Circle
        showProgress={
          timerState.status === PomodoroStatus.RUNNING ||
          timerState.status === PomodoroStatus.PAUSED
        }
        progress={timer.progress}
        timeRemaining={readableTimeLeft}
      />
      <div className="relative top-10 flex justify-center gap-6">
        <IconContext.Provider value={{ size: "2.25em" }}>
          {timerState.status === PomodoroStatus.UNSTARTED && (
            <button onClick={onStartClick}>
              <FiPlay />
            </button>
          )}
          {[PomodoroStatus.RUNNING, PomodoroStatus.PAUSED].includes(timerState.status) && (
            <button onClick={onStopClick} disabled={disableButtons}>
              <FiX />
            </button>
          )}
          {timerState.status === PomodoroStatus.RUNNING && (
            <button onClick={onPauseClick} disabled={disableButtons}>
              <FiPause />
            </button>
          )}
          {timerState.status === PomodoroStatus.RUNNING && (
            <button onClick={timer.addOneMinute} className={"w-9 text-center text-3xl"}>
              +1
            </button>
          )}
          {timerState.status === PomodoroStatus.PAUSED && (
            <>
              <button onClick={onResumeClick}>
                <FiPlay />
              </button>
              <span className={"block w-9"} />
            </>
          )}
        </IconContext.Provider>
      </div>
    </div>
  );
}
