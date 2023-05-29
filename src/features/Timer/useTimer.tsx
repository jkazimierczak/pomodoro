import { useEffect, useRef, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";
import { HistoryItemType } from "@/features/Timer/timerSlice";

interface useTimer {
  sessionDuration: number;
  breakDuration: number;
  longBreakDuration: number;
}

export function useTimer({ sessionDuration, breakDuration, longBreakDuration }: useTimer) {
  const [durations, setDurations] = useState({ sessionDuration, breakDuration, longBreakDuration });

  const [progress, setProgress] = useState<number>(0);

  const startDate = useRef<Temporal.PlainTime>();
  const endDate = useRef<Temporal.PlainTime>();
  const [timeLeft, setTimeLeft] = useState<Temporal.Duration>(
    Temporal.Duration.from({ minutes: durations.sessionDuration })
  );
  // const [readableTimeLeft, setReadableTimeLeft] = useState(readableTime(timeLeft));
  const intervalRef = useRef<number>();

  const secondsLeft = () => timeLeft?.total("seconds") ?? durations.sessionDuration * 60;

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
    setTimeLeft(Temporal.Duration.from({ minutes: durations.sessionDuration }));
  }, [durations.sessionDuration, durations.breakDuration, durations.longBreakDuration]);

  useEffect(() => {
    const progress = 1 - secondsLeft() / (durations.sessionDuration * 60);
    setProgress(progress);

    if (progress >= 1) {
      clearInterval(intervalRef.current);
      return;
    }
  }, [timeLeft?.total("seconds")]);

  function start(sessionType: HistoryItemType) {
    let sessionDuration;
    if (sessionType === HistoryItemType.SESSION) {
      sessionDuration = Temporal.Duration.from({ minutes: durations.sessionDuration });
    } else if (sessionType === HistoryItemType.BREAK) {
      sessionDuration = Temporal.Duration.from({ minutes: durations.breakDuration });
    } else {
      sessionDuration = Temporal.Duration.from({ minutes: durations.longBreakDuration });
    }

    const timeNow = Temporal.Now.plainTimeISO().round({
      smallestUnit: "seconds",
      roundingMode: "floor",
    });
    startDate.current = timeNow;
    endDate.current = timeNow.add(sessionDuration);

    advanceTimer();
    intervalRef.current = setInterval(() => advanceTimer(), 100);
  }

  function pause() {
    clearInterval(intervalRef.current);
  }

  function resume() {
    endDate.current = Temporal.Now.plainTimeISO()
      .round({
        smallestUnit: "seconds",
        roundingMode: "floor",
      })
      .add(timeLeft);

    intervalRef.current = setInterval(advanceTimer, 1000);
  }

  function stop() {
    clearInterval(intervalRef.current);
    setProgress(0);
  }

  return { progress, start, pause, resume, stop, setDurations, timeLeft };
}
