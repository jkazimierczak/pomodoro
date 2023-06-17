import React from "react";

interface ICircle {
  showProgress: boolean;
  progress: number;
  timeRemaining: string;
}

export function Circle({ showProgress, progress, timeRemaining }: ICircle) {
  return (
    <div className="mx-auto grid grid max-w-fit" style={{ gridTemplateAreas: "clock" }}>
      <svg
        viewBox="0 0 260 260"
        width="260"
        height="260"
        id="timerSVGCanvas"
        style={{ gridArea: "clock" }}
      >
        <circle
          cx="130"
          cy="130"
          r="123"
          strokeWidth="6"
          fill="none"
          className="outer-circle stroke-neutral-300 dark:stroke-neutral-700"
        ></circle>
        {showProgress && (
          <circle
            cx="130"
            cy="130"
            r="123"
            strokeWidth="7"
            fill="none"
            className="progress-circle stroke-sky-500 transition-all duration-700 ease-linear"
            strokeDasharray="772"
            strokeDashoffset="772"
            style={{
              rotate: "-90deg",
              transformOrigin: "50% 50%",
              display: "initial",
              strokeDashoffset: 770.771 * (1 - progress),
            }}
          ></circle>
        )}
      </svg>
      <p
        className="select-none self-center justify-self-center text-4xl text-neutral-900 dark:text-neutral-100"
        style={{ gridArea: "clock" }}
      >
        {timeRemaining}
      </p>
    </div>
  );
}
