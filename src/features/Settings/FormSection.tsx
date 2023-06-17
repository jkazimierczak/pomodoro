import { ReactNode } from "react";

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-4">
      <hr className="my-2.5 w-full border-neutral-300 dark:border-neutral-700" />

      <header className="mb-2 text-center uppercase text-neutral-500">{title}</header>
      {children}
    </div>
  );
}
