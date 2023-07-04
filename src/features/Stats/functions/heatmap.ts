import { Temporal } from "@js-temporal/polyfill";

/**
 * Find minimal and maximal values in grouped data.
 * @param data Grouped data.
 */
export function getMinMax(data: Record<string, number>) {
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
export function createThresholds(min: number, max: number) {
  const step = (max - min) / 5;

  return {
    1: min,
    2: min + step,
    3: min + step + step,
    4: max - step,
    5: max,
  };
}

export function levelFromData(data: number, thresholds: Record<number, number>) {
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
export function createHeatmapData(
  data: Record<string, number>,
  thresholds: Record<number, number>
) {
  const sortedKeys = Object.keys(data).sort();
  if (!sortedKeys.length) return {};

  const oldestDate = Temporal.PlainDate.from(sortedKeys[0]);
  const dateDiff = oldestDate.until(Temporal.Now.plainDateISO()).total("days");

  const dataMap: Record<string, ReturnType<typeof levelFromData>> = {};
  sortedKeys.forEach((key) => (dataMap[key] = levelFromData(data[key], thresholds)));

  return dataMap;
}
