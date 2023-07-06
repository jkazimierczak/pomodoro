import { countStreaks } from "./streaks";

jest.useFakeTimers().setSystemTime(new Date("2023-07-07"));

const dates = ["2023-07-01", "2023-07-02", "2023-07-03", "2023-07-04", "2023-07-05", "2023-07-06"];

test("Single continued streak is counted correctly", () => {
  expect(countStreaks(dates)).toMatchObject({
    longestStreak: 6,
    currentStreak: 6,
    isAboutToExpire: true,
  });
});

test("Past streak is counted correctly", () => {
  const last = dates.length - 1;
  let data = [dates[0], dates[1], dates[last]];
  expect(countStreaks(data)).toEqual({
    longestStreak: 2,
    currentStreak: 1,
    isAboutToExpire: true,
  });

  data = [
    "2023-06-20",
    "2023-06-21",
    "2023-06-22",
    "2023-06-23",
    dates[last - 2],
    dates[last - 1],
    dates[last],
  ];
  expect(countStreaks(data)).toEqual({
    longestStreak: 4,
    currentStreak: 3,
    isAboutToExpire: true,
  });

  data = [...data, "2023-07-07"];
  expect(countStreaks(data)).toEqual({
    longestStreak: 4,
    currentStreak: 4,
    isAboutToExpire: false,
  });
});

test("Intermittent streak is counted correctly", () => {
  const data = ["2023-06-20", dates[0], dates[2], dates[3], dates[4]];
  expect(countStreaks(data)).toEqual({
    longestStreak: 3,
    currentStreak: 0,
    isAboutToExpire: false,
  });
});
