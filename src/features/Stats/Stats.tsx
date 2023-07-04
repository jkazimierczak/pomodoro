import React, { ComponentProps } from "react";
import { Panel } from "@/features/Panel";
import { FiBarChart2 } from "react-icons/all";
import { Tile } from "@/features/Stats/Tile";
import { Heatmap, HeatmapCell } from "@/features/Stats/Heatmap";
import { FinishedPomodoro } from "@/features/Timer";
import { getStoredProgressHistory } from "@/common/localStorage";
import { Temporal } from "@js-temporal/polyfill";
import { createHeatmapData, createThresholds, getMinMax } from "@/features/Stats/functions";

interface StatsProps extends ComponentProps<"form"> {
  onClose: () => void;
}

/**
 * Group progress by dates. Multiple sessions from the same date will be summed.
 * @param progress An array of FinishedPomodoro objects.
 */
function groupByDates(progress: FinishedPomodoro[]) {
  const getDate = (finishedAt: string) => finishedAt.slice(0, "0000-00-00".length);
  const progressMap: Record<string, number> = {};

  const keys = progress.map((item) => getDate(item.finishedAt));
  keys.forEach((key) => Object.assign(progressMap, { [key]: 0 }));

  progress.forEach((item) => (progressMap[getDate(item.finishedAt)] += item.duration));

  return progressMap;
}

export function Stats({ onClose, ...props }: StatsProps) {
  const progressHistory = getStoredProgressHistory();
  const groupedByDates = groupByDates(progressHistory);

  const sessionsFinished = progressHistory.length;
  const timeFocusedMinutes = progressHistory.reduce((acc, item) => acc + item.duration, 0);
  const timeFocusedHours = Math.round(
    Temporal.Duration.from({ minutes: timeFocusedMinutes }).total("hours")
  );

  // Heatmap
  const minMax = getMinMax(groupedByDates);
  const thresholds = createThresholds(minMax.min, minMax.max);
  const heatmapData = createHeatmapData(groupedByDates, thresholds);

  return (
    <Panel
      onClose={onClose}
      icon={<FiBarChart2 />}
      headerText="Stats"
      className="absolute right-0 top-0 h-screen w-screen overflow-y-auto bg-white p-5 shadow shadow-gray-700 transition-colors dark:bg-neutral-900 dark:text-neutral-200 sm:w-[440px]"
    >
      <div className="mb-2.5 grid grid-cols-2 gap-2.5">
        <Tile title="Sessions finished" body={sessionsFinished} />
        <Tile title="Time focused" body={`${timeFocusedHours} h`} />
      </div>

      <div className="text- mb-2.5 flex items-center justify-center gap-2.5 text-neutral-500">
        <span>Less</span>
        <table className="w-max border-separate border-spacing-0.5">
          <tbody>
            <tr>
              <HeatmapCell level={1} />
              <HeatmapCell level={2} />
              <HeatmapCell level={3} />
              <HeatmapCell level={4} />
              <HeatmapCell level={5} />
            </tr>
          </tbody>
        </table>
        <span>More</span>
      </div>

      <div className="mb-1 text-center uppercase text-neutral-400">Heatmap</div>
      <Heatmap data={heatmapData} />
    </Panel>
  );
}
