interface ICircle {
  showProgress: boolean;
  progress: number;
  timeRemaining: string;
}

export function Circle({ showProgress, progress, timeRemaining }: ICircle) {
  return (
    <div className="grid grid max-w-fit" style={{ gridTemplateAreas: "clock" }}>
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
          stroke="#E1E1E1"
          strokeWidth="6"
          fill="none"
          className="outer-circle"
        ></circle>
        {!showProgress && (
          <circle
            cx="130"
            cy="130"
            r="123"
            stroke="#292929"
            strokeWidth="7"
            fill="none"
            className="progress-circle"
            strokeDasharray="772"
            strokeDashoffset="772"
            style={{
              rotate: "-90deg",
              transformOrigin: "50% 50%",
              display: "initial",
              transition: "stroke-dashoffset 1s linear 0s",
              strokeDashoffset: 770.771 * (1 - progress),
            }}
          ></circle>
        )}
      </svg>
      <p className="self-center justify-self-center text-3xl" style={{ gridArea: "clock" }}>
        {timeRemaining}
      </p>
    </div>
  );
}
