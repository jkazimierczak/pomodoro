import React from "react";
import { TransitionProps } from "./types";
import { Direction } from "@/common";
import "./base.css";
import "./Slide.css";
import { BaseTransition } from "@/features/Transitions/BaseTransition";

const fromTop = {
  appear: "opacity-0 -translate-y-full",
  appearActive: "transition-opacity-transform duration-300 opacity-100 translate-y-0",
  enter: "opacity-0 -translate-y-full",
  enterActive: "transition-opacity-transform duration-300 opacity-100 translate-y-0",
  exitActive: "transition-opacity-transform duration-250 opacity-0 -translate-y-full",
};

const fromRight = {
  appear: "animate opacity-0",
  appearActive: "fadeInRight",
  enter: "animate opacity-0",
  enterActive: "fadeInRight",
  exit: "animate",
  exitActive: "transition-opacity-transform duration-250 opacity-0 translate-x-full",
};

const fromBottom = {
  appear: "opacity-0",
  appearActive: "fadeInBottom",
  enter: "opacity-0",
  enterActive: "fadeInBottom",
  exitActive: "transition-opacity-transform duration-250 opacity-0 translate-y-full",
};

const fromLeft = {
  appear: "opacity-0 -translate-x-full",
  appearActive: "transition-opacity-transform duration-300 opacity-100 translate-x-0",
  enter: "opacity-0 -translate-x-full",
  enterActive: "transition-opacity-transform duration-300 opacity-100 translate-x-0",
  exitActive: "transition-opacity-transform duration-250 opacity-0 -translate-x-full",
};

type SlideProps = TransitionProps & {
  from?: Direction;
};

export function Slide({ children, from, ...props }: SlideProps) {
  let classNames;
  switch (from) {
    case "top":
    default:
      classNames = fromTop;
      break;
    case "right":
      classNames = fromRight;
      break;
    case "bottom":
      classNames = fromBottom;
      break;
    case "left":
      classNames = fromLeft;
      break;
  }

  return (
    <BaseTransition {...props} classNames={classNames}>
      {children}
    </BaseTransition>
  );
}
