import { Temporal } from "@js-temporal/polyfill";

/**
 * Return MM:SS formatted string from duration.
 * @param duration A Temporal.Duration instance.
 */
export function readableTime(duration: Temporal.Duration): string {
  const rounded = duration.round("seconds");
  let seconds = rounded.total("seconds") % 60;
  let minutes = Math.floor(rounded.total("minutes"));

  if (minutes < 0) minutes = 0;
  if (seconds < 0) seconds = 0;

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
