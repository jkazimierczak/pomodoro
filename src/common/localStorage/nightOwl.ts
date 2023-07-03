import { Temporal } from "@js-temporal/polyfill";

export const LS_NEXT_MIDNIGHT_KEY = "next_midnight";

export function getStoredNextMidnight(): Temporal.PlainDateTime | null {
  const stored = localStorage.getItem(LS_NEXT_MIDNIGHT_KEY);
  return stored ? Temporal.PlainDateTime.from(stored) : null;
}
