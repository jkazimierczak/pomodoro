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
  const [progress, setProgress] = useState<number>(0);
  const startDate = useRef<Temporal.PlainTime>();
  const endDate = useRef<Temporal.PlainTime>();
  const [timeLeft, setTimeLeft] = useState<Temporal.Duration>(
    Temporal.Duration.from({ minutes: settings.sessionDuration })
  );
  const [readableTimeLeft, setReadableTimeLeft] = useState(readableTime(timeLeft));
  const intervalRef = useRef<number>();

  function updateTimerSettings() {
    dispatch(
      initialize({
        sessionCount: settings.dailyGoal,
        sessionDuration: settings.sessionDuration,
        breakDuration: settings.breakDuration,
        longBreakDuration: settings.longBreakDuration,
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
    if (timerState.status === SessionStatus.UNSTARTED) {
      setTimeLeft(Temporal.Duration.from({ minutes: nextSession.duration }));
    }
  }, [nextSession.duration]);

  const secondsLeft = () => timeLeft?.total("seconds") ?? settings.sessionDuration * 60;

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

  useEffect(() => {
    setReadableTimeLeft(readableTime(timeLeft));
  }, [timeLeft.total("seconds")]);

  function cleanupTimer() {
    clearInterval(intervalRef.current);
    setProgress(0);
    setTimeout(() => setTimeLeft(Temporal.Duration.from({ minutes: nextSession.duration })), 1100);
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

    let sessionDuration;
    if (nextSession.type === HistoryItemType.SESSION) {
      sessionDuration = Temporal.Duration.from({ minutes: settings.sessionDuration });
    } else if (nextSession.type === HistoryItemType.BREAK) {
      sessionDuration = Temporal.Duration.from({ minutes: settings.breakDuration });
    } else {
      sessionDuration = Temporal.Duration.from({ minutes: settings.longBreakDuration });
    }

    const timeNow = Temporal.Now.plainTimeISO().round({
      smallestUnit: "seconds",
      roundingMode: "floor",
    });
    startDate.current = timeNow;
    endDate.current = timeNow.add(sessionDuration);

    advanceTimer();
    intervalRef.current = setInterval(() => advanceTimer(), 1000);
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

      {timerState.history.length && (
        <Circle
          showProgress={
            timerState.status === SessionStatus.RUNNING ||
            timerState.status === SessionStatus.PAUSED
          }
          progress={progress}
          timeRemaining={readableTimeLeft}
        />
      )}
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
