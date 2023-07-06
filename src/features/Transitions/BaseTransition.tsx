import "./base.css";

import React, { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { CSSTransitionClassNames } from "react-transition-group/CSSTransition";

import { TransitionProps } from "@/features/Transitions/types";
import {
  getClassesFromProps,
  getTimeoutFromProps,
  prepareProps,
} from "@/features/Transitions/utils";

type BaseTransitionProps = TransitionProps & {
  classNames: CSSTransitionClassNames;
};

export function BaseTransition({ children, speed, classNames, ...props }: BaseTransitionProps) {
  const childrenRef = useRef(null);

  const timeout = getTimeoutFromProps(speed);
  const preparedClassNames = getClassesFromProps(classNames, speed, timeout);
  const preparedProps = prepareProps(props);

  return (
    <CSSTransition
      {...preparedProps}
      nodeRef={childrenRef}
      timeout={timeout}
      classNames={preparedClassNames}
    >
      {React.cloneElement(children, { ref: childrenRef })}
    </CSSTransition>
  );
}
