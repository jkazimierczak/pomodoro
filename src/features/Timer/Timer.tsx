import React, { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";
import { Circle } from "@/features/Timer/Circle";

interface ITimerProps extends React.ComponentProps<"div"> {}

const seconds = 60;

export function Timer(props: ITimerProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  // Using refs to mitigate stale state within a closure
  const startDate = useRef<Temporal.PlainTime>();
  const endDate = useRef<Temporal.PlainTime>();
  const [timeLeft, setTimeLeft] = useState<Temporal.Duration>();
  const intervalRef = useRef<number>();

  const secondsLeft = () => Math.floor(timeLeft?.total("seconds") ?? seconds);

  const advanceTimer = () => {
    if (!endDate.current) return;

    setTimeLeft(
      (timeElapsed) => (timeElapsed = Temporal.Now.plainTimeISO().until(endDate.current))
    );
  };

  useEffect(() => {
    if (secondsLeft() > 0) return;

    clearInterval(intervalRef.current);
  }, [timeLeft]);

  //#region EventHandlers
  const onStartClick = (event: MouseEvent<HTMLButtonElement>) => {
    setIsStarted(true);

    const timeNow = Temporal.Now.plainTimeISO();
    const sessionDuration = Temporal.Duration.from({ seconds: seconds });
    startDate.current = timeNow;
    endDate.current = timeNow.add(sessionDuration);

    // TODO: Investigate 1-sec delay on start
    intervalRef.current = setInterval(() => advanceTimer(), 1000);
  };

  const onSkipClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      setIsStarted(false);
      setIsPaused(false);

      clearInterval(intervalRef.current);
    },
    [intervalRef.current]
  );

  const onStopClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      setIsStarted(false);
      setIsPaused(false);

      clearInterval(intervalRef.current);
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
      <Circle
        showProgress={isStarted}
        progress={secondsLeft() / seconds}
        timeRemaining={`${seconds}`}
      />
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
