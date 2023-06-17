import { useRef, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";

export function useTimer(initialMinutes: number, intervalMs: number, animationMs?: number) {
  const [duration, setDuration] = useState(initialMinutes * 60);
  const previousDuration = useRef(initialMinutes * 60);
  const [progress, setProgress] = useState(0);
  const [animationSafeProgress, setAnimationSafeProgress] = useState(0);

  const startDate = useRef<Temporal.PlainDateTime>();
  const endDate = useRef<Temporal.PlainDateTime>();

  const intervalRef = useRef<number>();

  function getTimeLeft() {
    if (startDate.current && endDate.current) {
      return startDate.current.until(endDate.current);
    } else {
      return Temporal.Duration.from({ seconds: duration });
    }
  }

  function advanceTimer() {
    if (!startDate.current || !endDate.current) return;

    const timePassed = startDate.current.until(Temporal.Now.plainDateTimeISO());
    startDate.current = startDate.current.add(timePassed);

    const secondsLeft = getTimeLeft().total("milliseconds");
    const totalDuration = previousDuration.current * 1000;

    const progress = 1 - secondsLeft / totalDuration;
    if (progress < 0.5) {
      setProgress(progress);
      setAnimationSafeProgress(progress);
    } else {
      const animationSafe = 1 - (secondsLeft - (animationMs ?? 0)) / totalDuration;
      setProgress(progress);
      setAnimationSafeProgress(animationSafe);
    }
  }

  function start(duration: number) {
    const _duration = Temporal.Duration.from({ minutes: duration });
    previousDuration.current = _duration.total("seconds");
    setDuration(_duration.total("seconds"));

    const timeNow = Temporal.Now.plainDateTimeISO();
    startDate.current = timeNow;
    endDate.current = timeNow.add(_duration);

    advanceTimer();
    intervalRef.current = setInterval(() => advanceTimer(), intervalMs);
  }

  function addOneMinute() {
    if (!endDate.current) return;

    endDate.current = endDate.current?.add("PT1M");
    previousDuration.current += 60;
  }

  function pause() {
    clearInterval(intervalRef.current);
  }

  function resume() {
    endDate.current = Temporal.Now.plainDateTimeISO().add(getTimeLeft());

    intervalRef.current = setInterval(advanceTimer, intervalMs);
  }

  function stop() {
    clearInterval(intervalRef.current);
    setProgress(0);
    setAnimationSafeProgress(0);
  }

  function setDurationFromMinutes(minutes: number) {
    setDuration(minutes * 60);
  }

  return {
    progress,
    animationSafeProgress,
    start,
    addOneMinute,
    pause,
    resume,
    stop,
    setDuration: setDurationFromMinutes,
    timeLeft: getTimeLeft,
  };
}
