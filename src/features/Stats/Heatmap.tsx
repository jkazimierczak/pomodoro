import { ComponentProps, ReactNode } from "react";
import clsx from "clsx";
import { Temporal } from "@js-temporal/polyfill";

export interface HeatmapProps extends ComponentProps<"div"> {
  data: Record<string, number>;
}

export function HeatmapCell({ level }: { level: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <td
      className={clsx({
        "h-4 w-4 rounded-sm": true,
        "bg-stats-1": level === 1,
        "bg-stats-2": level === 2,
        "bg-stats-3": level === 3,
        "bg-stats-4": level === 4,
        "bg-stats-5": level === 5,
      })}
    />
  );
}

/**
 * Find minimal and maximal values in grouped data.
 * @param data Grouped data.
 */
function getMinMax(data: Record<string, number>) {
  const values = Object.values(data);

  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

/**
 * Create 5 evenly spaced thresholds between min and max.
 * @param min Minimal value.
 * @param max Maximal value.
 */
function createThresholds(min: number, max: number) {
  const step = (max - min) / 5;

  return {
    1: min,
    2: min + step,
    3: min + step + step,
    4: max - step,
    5: max,
  };
}

function levelFromData(data: number, thresholds: Record<number, number>) {
  if (thresholds["2"] < data && data < thresholds["3"]) {
    return 2;
  } else if (thresholds["3"] < data && data < thresholds["4"]) {
    return 3;
  } else if (thresholds["4"] < data && data < thresholds["5"]) {
    return 4;
  } else if (thresholds["5"] === data) {
    return 5;
  } else {
    return 1;
  }
}

/**
 * Create heatmap-ready data.
 * @param data Data
 * @param thresholds An object with thresholds.
 */
function createHeatmapData(data: Record<string, number>, thresholds: Record<number, number>) {
  const sortedKeys = Object.keys(data).sort();
  if (!sortedKeys.length) return {};

  const oldestDate = Temporal.PlainDate.from(sortedKeys[0]);
  const dateDiff = oldestDate.until(Temporal.Now.plainDateISO()).total("days");

  const dataMap: Record<string, ReturnType<typeof levelFromData>> = {};
  sortedKeys.forEach((key) => (dataMap[key] = levelFromData(data[key], thresholds)));

  return dataMap;
}

function getWeekDayName(number: number) {
  if (number === 0) return "Mon";
  else if (number === 1) return "Tue";
  else if (number === 2) return "Wed";
  else if (number === 3) return "Thu";
  else if (number === 4) return "Fri";
  else if (number === 5) return "Sat";
  else if (number === 6) return "Sun";
}

export function Heatmap({ data }: HeatmapProps) {
  const UTCWeekDay = new Date().getUTCDay();
  const weekday = (UTCWeekDay + 1) % 7;
  const N_COLS = 20;

  const minMax = getMinMax(data);
  const thresholds = createThresholds(minMax.min, minMax.max);
  const heatmapData = createHeatmapData(data, thresholds);

  const thisWeekMonday = Temporal.Now.plainDateISO().subtract({
    days: UTCWeekDay === 0 ? 6 : UTCWeekDay - 1,
  });
  const firstVisibleMonday = thisWeekMonday.subtract({ days: 7 * N_COLS });

  const rows = [];
  for (let i = 0; i < 7; i++) {
    const firstWeekday = firstVisibleMonday.add({ days: i });

    const row = [];
    for (let j = 0; j <= N_COLS; j++) {
      if (j === N_COLS && i + 1 >= weekday) {
        break;
      }

      if (j === 0) {
        const content = i % 2 == 0 ? getWeekDayName(i) : "";
        row.push(
          <td className="w-8 text-sm leading-3 text-neutral-500" key={`heatmap_lead_${i}`}>
            {content}
          </td>
        );
        continue;
      }

      let level: ReturnType<typeof levelFromData> = 1;
      const key = firstWeekday.add({ days: j * 7 }).toString();
      if (key in heatmapData) {
        level = heatmapData[key];
      }
      row.push(<HeatmapCell level={level} key={`heatmap_cell_${key}`} />);
    }
    rows.push(row);
  }

  return (
    <div className="overflow-x-auto overflow-y-hidden">
      <table className="w-max border-separate border-spacing-0.5">
        <tbody>
          {rows.map((row, i) => (
            <tr key={`heatmap_row_${i}`}>{row}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
