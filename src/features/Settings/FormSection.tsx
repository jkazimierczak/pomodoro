import { ReactNode } from "react";

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-4">
      <header className="text-4xl">{title}</header>
      {children}
    </div>
  );
}
