import React, { MouseEvent, useEffect, useRef, useState } from "react";
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
  SessionDurations,
  SessionResult,
  SessionStatus,
  start,
  skip,
  stop,
  pause,
  resume,
} from "@/features/Timer/timerSlice";

interface ITimerProps extends React.ComponentProps<"div"> {
  initialDurations: SessionDurations;
}

export function Timer({ initialDurations, ...props }: ITimerProps) {
  const dispatch = useAppDispatch();
  const timer = useAppSelector((state) => state.timer);

  // Using refs to mitigate stale state within a closure
  const [progress, setProgress] = useState<number>(0);
  const startDate = useRef<Temporal.PlainTime>();
  const endDate = useRef<Temporal.PlainTime>();
  const [timeLeft, setTimeLeft] = useState<Temporal.Duration>(
    Temporal.Duration.from({ minutes: initialDurations.session })
  );
  const intervalRef = useRef<number>();

  useEffect(() => {
    dispatch(initialize(initialDurations));
  }, [initialDurations.session, initialDurations.break]);

  const secondsLeft = () => timeLeft?.total("seconds") ?? timer.duration.session * 60;

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
    setTimeLeft(Temporal.Duration.from({ minutes: timer.duration.session }));
  }

  useEffect(() => {
    if (timer.status === SessionStatus.RUNNING) {
      setProgress(1 - secondsLeft() / (timer.duration.session * 60));
    }

    if (secondsLeft() >= 0) return;

    cleanupTimer();
  }, [timeLeft?.total("seconds")]);

  //#region EventHandlers
  const onStartClick = (event: MouseEvent<HTMLButtonElement>) => {
    dispatch(start());

    const timeNow = Temporal.Now.plainTimeISO().round({
      smallestUnit: "seconds",
      roundingMode: "floor",
    });
    const sessionDuration = Temporal.Duration.from({ minutes: timer.duration.session });
    startDate.current = timeNow;
    endDate.current = timeNow.add(sessionDuration);

    advanceTimer();
    intervalRef.current = setInterval(() => advanceTimer(), 1000);
  };

  const onSkipClick = (event: MouseEvent<HTMLButtonElement>) => {
    setTimeout(() => dispatch(skip()), 1100);
    cleanupTimer();
  };

  const onStopClick = (event: MouseEvent<HTMLButtonElement>) => {
    setTimeout(() => dispatch(stop()), 1100);
    cleanupTimer();
  };

  const onPauseClick = (event: MouseEvent<HTMLButtonElement>) => {
    dispatch(pause());

    clearInterval(intervalRef.current);
  };

  const onResumeClick = (event: MouseEvent<HTMLButtonElement>) => {
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
        {timer.status === SessionStatus.UNSTARTED
          ? "Start session?"
          : timer.status === SessionStatus.PAUSED
          ? "Session paused"
          : "Session ongoing"}
      </p>

      {timer.status !== SessionStatus.UNINITIALIZED && (
        <ul
          className="absolute left-1/2 top-2.5 flex justify-center"
          style={{ transform: "translateX(-50%)" }}
        >
          <IconContext.Provider value={{ size: "1.25em", color: "#bcbcbcc9" }}>
            {timer.history.map((item, idx) => (
              <li key={`TimerState${idx}`}>
                {item.result === SessionResult.COMPLETED && <FiCheckCircle />}
                {item.result === SessionResult.SKIPPED && <FiArrowRightCircle />}
                {item.result === SessionResult.UNKNOWN && <FiCircle />}
              </li>
            ))}
          </IconContext.Provider>
        </ul>
      )}

      <Circle
        showProgress={timer.status === SessionStatus.RUNNING}
        progress={progress}
        timeRemaining={timeLeft ? readableTime(timeLeft) : `${timer.duration.session}:00`}
      />
      <div className="relative top-10 flex justify-center gap-6">
        <IconContext.Provider value={{ size: "2.25em" }}>
          {timer.status === SessionStatus.UNSTARTED && (
            <button onClick={onStartClick}>
              <FiPlay />
            </button>
          )}
          {[SessionStatus.RUNNING, SessionStatus.PAUSED].includes(timer.status) && (
            <button onClick={onStopClick}>
              <FiX />
            </button>
          )}
          {timer.status === SessionStatus.RUNNING && (
            <button onClick={onPauseClick}>
              <FiPause />
            </button>
          )}
          {timer.status === SessionStatus.PAUSED && (
            <button onClick={onResumeClick}>
              <FiPlay />
            </button>
          )}
          {[SessionStatus.RUNNING, SessionStatus.PAUSED].includes(timer.status) && (
            <button onClick={onSkipClick}>
              <FiSkipForward />
            </button>
          )}
        </IconContext.Provider>
      </div>
    </div>
  );
}
