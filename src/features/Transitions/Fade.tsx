import React from "react";
import { TransitionProps } from "./types";
import "./base.css";
import "./Fade.css";
import { BaseTransition } from "@/features/Transitions/BaseTransition";

const classNames = {
  appear: "animate",
  appearActive: "fadeIn",
  enter: "animate",
  enterActive: "fadeIn",
  exit: "animate",
  exitActive: "fadeOut",
};

export function Fade({ children, speed, ...props }: TransitionProps) {
  return (
    <BaseTransition {...props} classNames={classNames}>
      {children}
    </BaseTransition>
  );
}
