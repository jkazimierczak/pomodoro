import React, { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";
import { Circle } from "@/features/Timer/Circle";

interface ITimerProps extends React.ComponentProps<"div"> {}

const seconds = 10;

export function Timer(props: ITimerProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  // Using refs to mitigate stale state within a closure
  const [progress, setProgress] = useState<number>(0);
  const startDate = useRef<Temporal.PlainTime>();
  const endDate = useRef<Temporal.PlainTime>();
  const [timeLeft, setTimeLeft] = useState<Temporal.Duration>();
  const intervalRef = useRef<number>();

  const secondsLeft = () => timeLeft?.total("seconds") ?? seconds;

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

    setTimeout(() => {
      setTimeLeft(Temporal.Duration.from({ seconds: 0 }));
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

  const onSkipClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      setIsStarted(false);
      setIsPaused(false);

      cleanupTimer();
    },
    [intervalRef.current]
  );

  const onStopClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      setIsStarted(false);
      setIsPaused(false);

      cleanupTimer();
    },
    [intervalRef.current]
  );

  const onPauseClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      setIsPaused(true);

      clearInterval(intervalRef.current);
    },
    [intervalRef.current]
  );

  const onResumeClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      setIsPaused(false);

      intervalRef.current = setInterval(advanceTimer, 1000);
    },
    [intervalRef.current]
  );
  //#endregion

  return (
    <div {...props}>
      <Circle showProgress={isStarted} progress={progress} timeRemaining={`${secondsLeft()}`} />
      <div className="flex justify-evenly">
        {!isStarted && <button onClick={onStartClick}>start</button>}
        {(isStarted || isPaused) && <button onClick={onSkipClick}>skip</button>}
        {(isStarted || isPaused) && <button onClick={onStopClick}>stop</button>}
        {isStarted && !isPaused && <button onClick={onPauseClick}>pause</button>}
        {isPaused && <button onClick={onResumeClick}>resume</button>}
      </div>
    </div>
  );
}
