import React, { MouseEvent, useCallback, useState } from "react";
import { Circle } from "@/features/Timer/Circle";

interface ITimerProps extends React.ComponentProps<"div"> {}

export function Timer(props: ITimerProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const onStartClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setIsStarted(true);
  }, []);

  const onSkipClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setIsStarted(false);
    setIsPaused(false);
  }, []);

  const onStopClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setIsStarted(false);
    setIsPaused(false);
  }, []);

  const onPauseClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setIsPaused(true);
  }, []);

  const onResumeClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setIsPaused(false);
  }, []);

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
