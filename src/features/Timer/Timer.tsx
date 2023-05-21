import React, { useEffect, useRef, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";
import { Circle } from "@/features/Timer/Circle";
import {
  FiArrowRightCircle,
  FiCheckCircle,
  FiCircle,
  FiPause,
  FiPlay,
  FiSkipForward,
  FiX,
} from "react-icons/fi";
import { IconContext } from "react-icons";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  initialize,
  SessionResult,
  SessionStatus,
  start,
  skip,
  stop,
  pause,
  resume,
  finished,
} from "@/features/Timer/timerSlice";

interface ITimerProps extends React.ComponentProps<"div"> {}

export function Timer({ ...props }: ITimerProps) {
  const dispatch = useAppDispatch();
  const timerState = useAppSelector((state) => state.timer);
  const settings = useAppSelector((state) => state.settings);

  // Using refs to mitigate stale state within a closure
  const [progress, setProgress] = useState<number>(0);
  const startDate = useRef<Temporal.PlainTime>();
  const endDate = useRef<Temporal.PlainTime>();
  const [timeLeft, setTimeLeft] = useState<Temporal.Duration>(
    Temporal.Duration.from({ minutes: settings.sessionDuration })
  );
  const intervalRef = useRef<number>();

  useEffect(() => {
    dispatch(initialize(settings.dailyGoal));
  }, [settings.dailyGoal]);

  const secondsLeft = () => timeLeft?.total("seconds") ?? settings.sessionDuration * 60;

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

  // Beware - it's a closure
  const advanceTimer = () => {
    if (!endDate.current) return;

    setTimeLeft(
      Temporal.Now.plainTimeISO()
        .round({
          smallestUnit: "seconds",
          roundingMode: "floor",
        })
        .until(endDate.current)
    );
  };

  function cleanupTimer() {
    clearInterval(intervalRef.current);
    setProgress(0);
    setTimeLeft(Temporal.Duration.from({ minutes: settings.sessionDuration }));
  }

  useEffect(() => {
    if (timerState.status === SessionStatus.RUNNING) {
      setProgress(1 - secondsLeft() / (settings.sessionDuration * 60));
    }

    if (secondsLeft() >= 0) return;

    setTimeout(() => dispatch(finished()), 1100);
    cleanupTimer();
  }, [timeLeft?.total("seconds")]);

  //#region EventHandlers
  const onStartClick = () => {
    dispatch(start());

    const timeNow = Temporal.Now.plainTimeISO().round({
      smallestUnit: "seconds",
      roundingMode: "floor",
    });
    const sessionDuration = Temporal.Duration.from({ minutes: settings.sessionDuration });
    startDate.current = timeNow;
    endDate.current = timeNow.add(sessionDuration);

    advanceTimer();
    intervalRef.current = setInterval(() => advanceTimer(), 1000);
  };

  const onSkipClick = () => {
    setTimeout(() => dispatch(skip()), 1100);
    cleanupTimer();
  };

  const onStopClick = () => {
    setTimeout(() => dispatch(stop()), 1100);
    cleanupTimer();
  };

  const onPauseClick = () => {
    dispatch(pause());

    clearInterval(intervalRef.current);
  };

  const onResumeClick = () => {
    if (!timeLeft) return;

    dispatch(resume());

    endDate.current = Temporal.Now.plainTimeISO()
      .round({
        smallestUnit: "seconds",
        roundingMode: "floor",
      })
      .add(timeLeft);

    intervalRef.current = setInterval(advanceTimer, 1000);
  };
  //#endregion

  return (
    <div {...props}>
      <p className="relative bottom-10 text-center text-4xl">
        {timerState.status === SessionStatus.UNSTARTED && "Start session?"}
        {timerState.status === SessionStatus.RUNNING && "Session ongoing"}
        {timerState.status === SessionStatus.PAUSED && "Session paused"}
      </p>

      {timerState.status !== SessionStatus.UNINITIALIZED && (
        <ul
          className="absolute left-1/2 top-2.5 flex justify-center"
          style={{ transform: "translateX(-50%)" }}
        >
          {timerState.history.map((item, idx) => (
            <IconContext.Provider
              key={`TimerState${idx}`}
              value={
                idx === timerState.currentSessionIdx &&
                timerState.status !== SessionStatus.UNSTARTED
                  ? { size: "1.25em" }
                  : { size: "1.25em", color: "#bcbcbcc9" }
              }
            >
              <li>
                {item.result === SessionResult.COMPLETED && <FiCheckCircle />}
                {item.result === SessionResult.SKIPPED && <FiArrowRightCircle />}
                {item.result === SessionResult.UNKNOWN && <FiCircle />}
              </li>
            </IconContext.Provider>
          ))}
        </ul>
      )}

      <Circle
        showProgress={timerState.status === SessionStatus.RUNNING}
        progress={progress}
        timeRemaining={timeLeft ? readableTime(timeLeft) : `${settings.sessionDuration}:00`}
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
          {[SessionStatus.RUNNING, SessionStatus.PAUSED].includes(timerState.status) && (
            <button onClick={onSkipClick}>
              <FiSkipForward />
            </button>
          )}
        </IconContext.Provider>
      </div>
    </div>
  );
}
