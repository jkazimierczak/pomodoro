import { Temporal } from "@js-temporal/polyfill";

/**
 * Compute next offset midnight.
 * @param time Temporal.PlainTime compatible time string.
 */
export function getNextMidnightFromString(time: string) {
  const _time = Temporal.PlainTime.from(time);
  return getNextMidnight(_time.hour, _time.minute);
}

/**
 * Compute next offset midnight.
 * @param offsetHours A number of hours to offset by.
 * @param offsetMinutes (optional) A number of minutes to offset by.
 */
export function getNextMidnight(offsetHours: number, offsetMinutes?: number) {
  return Temporal.Now.plainDateTime("gregory")
    .round({ smallestUnit: "day", roundingMode: "trunc" })
    .add({ days: 1, hours: offsetHours, minutes: offsetMinutes ?? 0 });
}
