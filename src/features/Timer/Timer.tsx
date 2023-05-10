import React, { MouseEvent, useEffect, useRef, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";
import { Circle } from "@/features/Timer/Circle";
import { FiPause, FiPlay, FiSkipForward, FiX } from "react-icons/fi";
import { IconContext } from "react-icons";

interface ITimerProps extends React.ComponentProps<"div"> {}

const seconds = 10;
const initialDuration = Temporal.Duration.from({ seconds: seconds });

export function Timer(props: ITimerProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  // Using refs to mitigate stale state within a closure
  const [progress, setProgress] = useState<number>(0);
  const startDate = useRef<Temporal.PlainTime>();
  const endDate = useRef<Temporal.PlainTime>();
  const [timeLeft, setTimeLeft] = useState<Temporal.Duration>(initialDuration);
  const intervalRef = useRef<number>();

  const secondsLeft = () => timeLeft?.total("seconds") ?? seconds;

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

    setTimeLeft(initialDuration);
    setTimeout(() => {
      setIsStarted(false);
      setIsPaused(false);
    }, 1100);
  }

  useEffect(() => {
    if (isStarted && !isPaused) {
      setProgress(1 - secondsLeft() / seconds);
    }

    if (secondsLeft() >= 0) return;

    cleanupTimer();
  }, [timeLeft?.total("seconds")]);

  //#region EventHandlers
  const onStartClick = (event: MouseEvent<HTMLButtonElement>) => {
    setIsStarted(true);

    const timeNow = Temporal.Now.plainTimeISO().round({
      smallestUnit: "seconds",
      roundingMode: "floor",
    });
    const sessionDuration = Temporal.Duration.from({ seconds: seconds });
    startDate.current = timeNow;
    endDate.current = timeNow.add(sessionDuration);

    advanceTimer();
    intervalRef.current = setInterval(() => advanceTimer(), 1000);
  };

  const onSkipClick = (event: MouseEvent<HTMLButtonElement>) => {
    cleanupTimer();
  };

  const onStopClick = (event: MouseEvent<HTMLButtonElement>) => {
    cleanupTimer();
  };

  const onPauseClick = (event: MouseEvent<HTMLButtonElement>) => {
    setIsPaused(true);

    clearInterval(intervalRef.current);
  };

  const onResumeClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!timeLeft) return;

    setIsPaused(false);

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
        {!isStarted
          ? "Start session?"
          : isStarted && isPaused
          ? "Session paused"
          : "Session ongoing"}
      </p>

      <Circle
        showProgress={isStarted}
        progress={progress}
        timeRemaining={timeLeft ? readableTime(timeLeft) : `00:00`}
      />
      <div className="relative top-10 flex justify-center gap-6">
        <IconContext.Provider value={{ size: "2.25em" }}>
          {!isStarted && (
            <button onClick={onStartClick}>
              <FiPlay />
            </button>
          )}
          {(isStarted || isPaused) && (
            <button onClick={onStopClick}>
              <FiX />
            </button>
          )}
          {isStarted && !isPaused && (
            <button onClick={onPauseClick}>
              <FiPause />
            </button>
          )}
          {isPaused && (
            <button onClick={onResumeClick}>
              <FiPlay />
            </button>
          )}
          {(isStarted || isPaused) && (
            <button onClick={onSkipClick}>
              <FiSkipForward />
            </button>
          )}
        </IconContext.Provider>
      </div>
    </div>
  );
}
