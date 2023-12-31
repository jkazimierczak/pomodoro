import { Temporal } from "@js-temporal/polyfill";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";
import { IconContext } from "react-icons";
import {
  FiCheckCircle,
  FiCircle,
  FiCode,
  FiPause,
  FiPauseCircle,
  FiPlay,
  FiX,
} from "react-icons/fi";
import { SwitchTransition } from "react-transition-group";

import { useAppDispatch, useAppSelector } from "@/app";
import { readableTime } from "@/common/helpers";
import { Fade, Slide } from "@/features/Transitions";

import { Circle } from "./Circle";
import { dummyAudioSrc, timerAudio } from "./timerAudio";
import {
  changeNextSessionType,
  finished,
  pause,
  PomodoroStatus,
  PomodoroType,
  resume,
  start,
  stop,
} from "./timerSlice";
import { useTimer } from "./useTimer";

enum ButtonNames {
  START = "START",
  STOP = "STOP",
  PAUSE = "PAUSE",
  RESUME = "RESUME",
  ADD_ONE_MINUTE = "ADD_ONE_MINUTE",
}

type ITimerProps = React.ComponentProps<"div">;

const animationMs = 750;

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
  const timer = useTimer(settings.sessionDuration, 100, animationMs);

  const [dimmedButtons, setDimmedButtons] = useState<string[]>([]);

  useEffect(() => {
    timer.setDuration(currentSession.duration);
    setReadableTimeLeft(readableTime(nextSessionDuration));
  }, [currentSession.duration]);

  function _stop(reducerAction: ActionCreatorWithoutPayload) {
    setTimeout(() => {
      dispatch(reducerAction());
      setReadableTimeLeft(readableTime(nextSessionDuration));
      setDisableButtons(false);
    }, animationMs);
    timer.stop();

    // finished-specific code
    if (reducerAction != finished) return;

    if (settings.canPlaySound) {
      timerAudio.src = import.meta.env.BASE_URL + "sounds/complete-chime.mp3";
    }

    let nextTime: number;
    switch (currentSession.type) {
      case PomodoroType.SESSION:
        if (!settings.autoStartBreaks) return;
        nextTime = settings.breakDuration;
        break;
      case PomodoroType.BREAK:
      case PomodoroType.LONG_BREAK:
        if (!settings.autoStartSessions) return;
        nextTime = settings.sessionDuration;
        break;
    }

    setTimeout(() => {
      dispatch(start());
      timer.start(nextTime);
    }, animationMs);
  }

  useEffect(() => {
    const readableTimeLeft = readableTime(timer.timeLeft());
    setReadableTimeLeft(readableTimeLeft);
    document.title = `${readableTimeLeft} | ${getSessionStateText()}`;

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
    timerAudio.src = dummyAudioSrc;

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
    setTimeout(() => setDisableButtons(false), animationMs);
  };

  const onResumeClick = () => {
    dispatch(resume());
    timer.resume();
  };

  function toggleNextSessionType() {
    dispatch(changeNextSessionType());
  }

  function dimAllButtonsExcept(buttonName: ButtonNames) {
    const buttonsToDim = Object.values(ButtonNames).filter((value) => value != buttonName);
    setDimmedButtons(buttonsToDim);
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

  function isPomodoroStarted(idx: number) {
    return (
      idx === timerState.currentSessionIdx &&
      timerState.status !== PomodoroStatus.UNSTARTED &&
      currentSession.type === PomodoroType.SESSION
    );
  }

  const Transition = timerState.status === PomodoroStatus.UNSTARTED ? Slide : Fade;

  return (
    <div {...props}>
      <div
        className={clsx({
          "relative bottom-10 flex justify-center": true,
          "hover:cursor-pointer": timerState.status === PomodoroStatus.UNSTARTED,
        })}
        onClick={toggleNextSessionType}
      >
        <div className="w-max select-none text-center text-4xl text-neutral-900 dark:text-neutral-100">
          <SwitchTransition>
            <Transition key={sessionStateText} from="top">
              <span className="flex items-center justify-center gap-2">
                <p>{sessionStateText}</p>
                {timerState.status === PomodoroStatus.UNSTARTED && (
                  <span className="rotate-90">
                    <IconContext.Provider
                      value={{ className: "text-neutral-700 dark:text-neutral-300 text-base" }}
                    >
                      <FiCode />
                    </IconContext.Provider>
                  </span>
                )}
              </span>
            </Transition>
          </SwitchTransition>
        </div>
      </div>

      <ul
        className="absolute left-1/2 top-2.5 flex justify-center"
        style={{ transform: "translateX(-50%)" }}
      >
        {progressCircles.map((circle, idx) => (
          <IconContext.Provider
            key={`TimerState${idx}`}
            value={{
              size: "1.25em",
              className: clsx({
                "transition-all": true,
                "text-sky-500": isPomodoroStarted(idx),
                "animate-pulse":
                  isPomodoroStarted(idx) && timerState.status === PomodoroStatus.PAUSED,
                "text-neutral-300 dark:text-neutral-500": !isPomodoroStarted(idx),
              }),
            }}
          >
            <>
              {idx !== 0 && idx % settings.sessionsBeforeLongBreak === 0 && (
                <span className="mx-1 block" />
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
        progress={timer.animationSafeProgress}
        timeRemaining={readableTimeLeft}
      />
      <div className="relative top-10 flex justify-center">
        <div className="inline-flex justify-center gap-6">
          <IconContext.Provider value={{ size: "2.5em" }}>
            {timerState.status === PomodoroStatus.UNSTARTED && (
              <button
                onClick={onStartClick}
                disabled={disableButtons}
                onMouseEnter={() => dimAllButtonsExcept(ButtonNames.START)}
                onMouseLeave={() => setDimmedButtons([])}
                className={clsx({
                  "text-neutral-900 transition-colors duration-200 ease-linear dark:text-neutral-300":
                    true,
                  "!text-neutral-300 dark:!text-neutral-500": dimmedButtons.includes(
                    ButtonNames.START
                  ),
                })}
              >
                <FiPlay />
              </button>
            )}
            {[PomodoroStatus.RUNNING, PomodoroStatus.PAUSED].includes(timerState.status) && (
              <Fade
                in={[PomodoroStatus.RUNNING, PomodoroStatus.PAUSED].includes(timerState.status)}
                appear
              >
                <button
                  onClick={onStopClick}
                  disabled={disableButtons}
                  onMouseEnter={() => dimAllButtonsExcept(ButtonNames.STOP)}
                  onMouseLeave={() => setDimmedButtons([])}
                  className={clsx({
                    "text-neutral-900 transition-colors duration-200 ease-linear dark:text-neutral-300":
                      true,
                    "!text-neutral-300 dark:!text-neutral-500": dimmedButtons.includes(
                      ButtonNames.STOP
                    ),
                  })}
                >
                  <FiX />
                </button>
              </Fade>
            )}
            {timerState.status === PomodoroStatus.RUNNING && (
              <button
                onClick={onPauseClick}
                disabled={disableButtons}
                onMouseEnter={() => dimAllButtonsExcept(ButtonNames.PAUSE)}
                onMouseLeave={() => setDimmedButtons([])}
                className={clsx({
                  "text-neutral-900 transition-colors duration-200 ease-linear dark:text-neutral-300":
                    true,
                  "!text-neutral-300 dark:!text-neutral-500": dimmedButtons.includes(
                    ButtonNames.PAUSE
                  ),
                })}
              >
                <FiPause />
              </button>
            )}
            {timerState.status === PomodoroStatus.RUNNING && (
              <Fade in={timerState.status === PomodoroStatus.RUNNING} appear>
                <button
                  onClick={timer.addOneMinute}
                  disabled={disableButtons}
                  onMouseEnter={() => dimAllButtonsExcept(ButtonNames.ADD_ONE_MINUTE)}
                  onMouseLeave={() => setDimmedButtons([])}
                  className={clsx({
                    "w-10 select-none text-center text-3xl transition-colors duration-200 ease-linear dark:text-neutral-300":
                      true,
                    "!text-neutral-300 dark:!text-neutral-500": dimmedButtons.includes(
                      ButtonNames.ADD_ONE_MINUTE
                    ),
                  })}
                >
                  +1
                </button>
              </Fade>
            )}
            {timerState.status === PomodoroStatus.PAUSED && (
              <>
                <button
                  onClick={onResumeClick}
                  disabled={disableButtons}
                  onMouseEnter={() => dimAllButtonsExcept(ButtonNames.RESUME)}
                  onMouseLeave={() => setDimmedButtons([])}
                  className={clsx({
                    "text-neutral-900 transition-colors duration-200 ease-linear dark:text-neutral-300":
                      true,
                    "!text-neutral-300 dark:!text-neutral-500": dimmedButtons.includes(
                      ButtonNames.RESUME
                    ),
                  })}
                >
                  <FiPlay />
                </button>
                <span className={"block w-9"} />
              </>
            )}
          </IconContext.Provider>
        </div>
      </div>
    </div>
  );
}
