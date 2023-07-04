import { IconContext } from "react-icons";
import { FiX } from "react-icons/fi";
import React, { ComponentProps, ReactNode } from "react";
import { Spacer } from "@/features/Spacer";

interface PanelProps extends ComponentProps<"div"> {
  children: ReactNode;
  headerText: string;
  onClose: () => void;
  icon: ReactNode;
  rightSideSlot?: ReactNode;
}

export function Panel({
  children,
  headerText,
  onClose,
  icon,
  rightSideSlot,
  ...props
}: PanelProps) {
  return (
    <div {...props}>
      <header className="between flex justify-between">
        <IconContext.Provider value={{ size: "2em" }}>
          <div className="flex items-center gap-2">
            {icon}
            <p className="text-4xl font-medium">{headerText}</p>
          </div>

          <div className="flex gap-2">
            {rightSideSlot && rightSideSlot}
            {!rightSideSlot && (
              <button onClick={onClose}>
                <FiX />
              </button>
            )}
          </div>
        </IconContext.Provider>
      </header>

      <Spacer />

      {children}
    </div>
  );
}