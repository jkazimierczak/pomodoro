import React from "react";
import { TransitionProps } from "./types";
import "./base.css";
import "./Fade.css";
import { BaseTransition } from "@/features/Transitions/BaseTransition";

const classNames = {
  appear: "animate opacity-0",
  appearActive: "fadeIn",
  enter: "animate opacity-0",
  enterActive: "fadeIn",
  exit: "animate",
  exitActive: "fadeOut",
};

export function Fade({ children, ...props }: TransitionProps) {
  return (
    <BaseTransition {...props} classNames={classNames}>
      {children}
    </BaseTransition>
  );
}
