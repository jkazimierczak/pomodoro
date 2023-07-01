import React, { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { TransitionProps } from "./types";

const classNames = {
  appear: "opacity-0",
  appearActive: "transition-opacity duration-300 opacity-100",
  enter: "opacity-0",
  enterActive: "transition-opacity duration-300 opacity-100",
  // exit: "opacity-100",  // this breaks the exit transition
  exitActive: "transition-opacity duration-250 opacity-0",
};

export function Fade({ children, ...props }: TransitionProps) {
  const childrenRef = useRef(null);

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
