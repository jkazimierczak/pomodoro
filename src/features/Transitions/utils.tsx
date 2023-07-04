import { TransitionProps, TransitionSpeed } from "@/features/Transitions/types";
import { CSSTransitionClassNames } from "react-transition-group/CSSTransition";

export function getTimeoutFromProps(speed: TransitionSpeed | undefined) {
  if (speed === "fast") {
    return {
      enter: 200,
      exit: 150,
    };
  } else if (speed === "faster") {
    return {
      enter: 150,
      exit: 150,
    };
  } else {
    return {
      enter: 300,
      exit: 250,
    };
  }
}

export function getClassesFromProps(
  base: CSSTransitionClassNames,
  speed: TransitionSpeed | undefined,
  timeouts: ReturnType<typeof getTimeoutFromProps>
): CSSTransitionClassNames {
  const { enter, exit } = timeouts;

  if (speed === "fast") {
    return {
      ...base,
      appear: `${base.appear} animate-${enter}`,
      enter: `${base.enter} animate-${enter}`,
      exit: `${base.exit} animate-${exit}`,
    };
  } else if (speed === "faster") {
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
