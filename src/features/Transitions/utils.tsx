import { CSSTransitionClassNames } from "react-transition-group/CSSTransition";

import { TransitionProps, TransitionSpeed } from "@/features/Transitions/types";

export function getTimeoutFromProps(speed: TransitionSpeed | undefined) {
  const timeouts = {
    default: {
      enter: 300,
      exit: 250,
    },
    fast: {
      enter: 200,
      exit: 150,
    },
    faster: {
      enter: 150,
      exit: 150,
    },
  };

  return timeouts[speed ?? "default"];
}

export function getClassesFromProps(
  base: CSSTransitionClassNames,
  speed: TransitionSpeed | undefined,
  timeouts: ReturnType<typeof getTimeoutFromProps>
): CSSTransitionClassNames {
  const { enter, exit } = timeouts;

  if (speed) {
    return {
      ...base,
      appear: `${base.appear} animate-${enter}`,
      enter: `${base.enter} animate-${enter}`,
      exit: `${base.exit} animate-${exit}`,
    };
  } else {
    return base;
  }
}

export function prepareProps(props: Omit<TransitionProps, "children">) {
  const copy: Record<string, unknown> = { ...props };
  const toRemove = ["fast", "faster"];

  toRemove.forEach((key) => key in copy && delete copy[key]);
  return copy;
}
