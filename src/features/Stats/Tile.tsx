import { ComponentProps, ReactNode } from "react";

interface TileProps extends ComponentProps<"div"> {
  title: string;
  body: ReactNode;
}

export function Tile({ title, body }: TileProps) {
  return (
    <div className="grow rounded border-2 border-sky-500 py-2">
      <div className="text-center">
        <p className="mb-1 text-center text-sm font-light uppercase dark:text-neutral-300">
          {title}
        </p>
        <p className="text-4xl font-medium">{body}</p>
      </div>
    </div>
  );
}
