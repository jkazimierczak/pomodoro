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

/**
 * Return formatted string from duration in form of <H> hour(s) <M> minute(s).
 * @param duration A Temporal.Duration instance.
 */
export function durationToHoursMinutes(duration: Temporal.Duration) {
  const hours = Math.floor(duration.total("hours"));
  const minutes = duration.subtract({ hours }).total("minutes");

  if (hours == 0 && minutes == 0) return;

  const suffixH = hours > 1 ? "s" : "";
  const suffixM = minutes > 1 ? "s" : "";

  const hoursStr = hours > 0 ? `${hours} hour${suffixH}` : "";
  const minutesStr = minutes > 0 ? `${minutes} minute${suffixM}` : "";

  return `${hoursStr} ${minutesStr}`;
}
