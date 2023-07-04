import React from "react";
import { TransitionProps } from "./types";
import { Direction } from "@/common";
import "./base.css";
import "./Slide.css";
import { BaseTransition } from "@/features/Transitions/BaseTransition";

const common = {
  appear: "animate opacity-0",
  enter: "animate opacity-0",
  exit: "animate",
};

const fromTop = {
  ...common,
  appearActive: "fadeInTop",
  enterActive: "fadeInTop",
  exitActive: "fadeOutTop",
};

const fromRight = {
  ...common,
  appearActive: "fadeInRight",
  enterActive: "fadeInRight",
  exitActive: "fadeOutRight",
};

const fromBottom = {
  ...common,
  appearActive: "fadeInBottom",
  enterActive: "fadeInBottom",
  exitActive: "fadeOutBottom",
};

const fromLeft = {
  ...common,
  appearActive: "fadeInLeft",
  enterActive: "fadeInLeft",
  exitActive: "fadeOutLeft",
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
