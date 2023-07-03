import { ComponentProps } from "react";
import clsx from "clsx";

export interface HeatmapProps extends ComponentProps<"div"> {}

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
  const weekday = (new Date().getUTCDay() + 1) % 7;

  const END = 20;
  const rows = [];
  for (let i = 0; i < 7; i++) {
    const row = [];

    for (let j = 0; j < END; j++) {
      if (j + 1 === END && i + 1 >= weekday) {
        break;
      }

      if (j == 0) {
        const content = i % 2 == 0 ? getWeekDayName(i) : "";
        row.push(
          <td className="w-8 text-sm leading-3 text-neutral-500" key={`heatmap_lead_${i}`}>
            {content}
          </td>
        );
      }
      row.push(<HeatmapCell level={1} key={`heatmap_cell_${i * END + j}`} />);
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
