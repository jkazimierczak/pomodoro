import React, { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { TransitionProps } from "./types";
import { Direction } from "@/common";

const fromTop = {
  appear: "opacity-0 -translate-y-full",
  appearActive: "transition-opacity-transform duration-300 opacity-100 translate-y-0",
  enter: "opacity-0 -translate-y-full",
  enterActive: "transition-opacity-transform duration-300 opacity-100 translate-y-0",
  exitActive: "transition-opacity-transform duration-250 opacity-0 -translate-y-full",
};

const fromRight = {
  appear: "transition-opacity-transform opacity-0 translate-x-full",
  appearActive: "transition-opacity-transform opacity-100 -translate-x-0",
  enter: "animated",
  enterActive: "fadeInRight",
  exitActive: "transition-opacity-transform duration-250 opacity-0 translate-x-full",
};

const fromBottom = {
  appear: "opacity-0 translate-y-full",
  appearActive: "transition-opacity-transform duration-300 opacity-100 -translate-y-0",
  enter: "opacity-0 translate-y-full",
  enterActive: "transition-opacity-transform duration-300 opacity-100 -translate-y-0",
  exitActive: "transition-opacity-transform duration-250 opacity-0 translate-y-full",
};

const fromLeft = {
  appear: "opacity-0 -translate-x-full",
  appearActive: "transition-opacity-transform duration-300 opacity-100 translate-x-0",
  enter: "opacity-0 -translate-x-full",
  enterActive: "transition-opacity-transform duration-300 opacity-100 translate-x-0",
  exitActive: "transition-opacity-transform duration-250 opacity-0 -translate-x-full",
};

export interface SlideProps extends TransitionProps {
  from?: Direction;
}

export function Slide({ children, from, ...props }: SlideProps) {
  const childrenRef = useRef(null);

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
    <CSSTransition
      {...props}
      nodeRef={childrenRef}
      timeout={{
        enter: 300,
        exit: 250,
      }}
      classNames={classNames}
    >
      {React.cloneElement(children, { ref: childrenRef })}
    </CSSTransition>
  );
}
