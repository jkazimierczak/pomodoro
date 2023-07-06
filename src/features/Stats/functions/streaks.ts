import { Temporal } from "@js-temporal/polyfill";

/**
 * Find current and the best daily-streak in the data.
 * @param data An array of date strings in format of YYYY-MM-DD.
 */
export function countStreaks(data: string[]) {
  const sortedDates = [...data].sort();

  if (!sortedDates.length) {
    return {
      isAboutToExpire: false,
      currentStreak: 0,
      longestStreak: 0,
    };
  }

  // Find the longest streak
  let longestStreak = 1;
  let streak = 1;
  let baseDate = Temporal.PlainDate.from(sortedDates[0]);
  for (let i = 1; i < sortedDates.length; i++) {
    const nextDate = Temporal.PlainDate.from(sortedDates[i]);

    const days = baseDate.until(nextDate).days;
    if (days === 1) {
      streak++;

      if (streak > longestStreak) {
        longestStreak = streak;
      }
    } else {
      streak = 1;
    }
    baseDate = nextDate;
  }

  // Find how long the current streak is
  const lastSorted = Temporal.PlainDate.from(sortedDates[sortedDates.length - 1]);
  const daysSinceLastPomodoro = Temporal.Now.plainDateISO().since(lastSorted).days;
  if (daysSinceLastPomodoro > 1) {
    return {
      isAboutToExpire: false,
      currentStreak: 0,
      longestStreak,
    };
  }

  let currentStreak = 1;
  baseDate = lastSorted;
  for (let i = sortedDates.length - 2; i >= 0; i--) {
    const prevDate = Temporal.PlainDate.from(sortedDates[i]);

    if (baseDate.since(prevDate).days === 1) {
      currentStreak++;
      baseDate = prevDate;
    } else {
      break;
    }
  }

  return {
    isAboutToExpire: !!daysSinceLastPomodoro,
    currentStreak,
    longestStreak,
  };
}
