import React, { MouseEvent, useCallback, useRef, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";
import { Circle } from "@/features/Timer/Circle";

interface ITimerProps extends React.ComponentProps<"div"> {}

export function Timer(props: ITimerProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startDate, setStartDate] = useState<Temporal.PlainTime>();
  const [endDate, setEndDate] = useState<Temporal.PlainTime>();
  const intervalRef = useRef<number>();

  function advanceTimer() {
    console.log(Temporal.Now.plainTimeISO().toString());
  }

  //#region EventHandlers
  const onStartClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      setIsStarted(true);

      const timeNow = Temporal.Now.plainTimeISO();
      const sessionDuration = Temporal.Duration.from({ minutes: 25 });
      setStartDate(timeNow);
      setEndDate(timeNow.add(sessionDuration));

      intervalRef.current = setInterval(advanceTimer, 1000);
    },
    [intervalRef.current]
  );

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
      <Circle showProgress={isStarted} progress={(20 * 60) / (25 * 60)} timeRemaining={"25:00"} />
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
