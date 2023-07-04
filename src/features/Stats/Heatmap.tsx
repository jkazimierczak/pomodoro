import { ComponentProps } from "react";
import clsx from "clsx";
import { Temporal } from "@js-temporal/polyfill";
import { levelFromData } from "@/features/Stats/functions/heatmap";

export interface HeatmapProps extends ComponentProps<"div"> {
  data: Record<string, 1 | 2 | 3 | 4 | 5>;
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
  const N_COLS = 19;

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

      let level: ReturnType<typeof levelFromData> = 1;
      const key = firstWeekday.add({ days: j * 7 }).toString();
      if (key in data) {
        level = data[key];
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
            <tr key={`heatmap_row_${i}`}>
              <td className="w-8 text-sm leading-3 text-neutral-500">
                {i % 2 === 0 && getWeekDayName(i)}
              </td>
              {row}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
