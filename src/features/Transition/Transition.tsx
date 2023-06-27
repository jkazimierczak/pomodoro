import { ReactNode, useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface TransitionProps {
  children: ReactNode;
  from: string;
  to: string;
  active: string;
  transitionOut?: boolean;
  appear?: boolean;
}

/**
 * Adds transition between from and to states for a children element.
 * @param children A children element.
 * @param from Classes representing starting state for enter and ending state for leave.
 * @param to Classes representing ending state for enter and starting state for leave.
 * @param active Classes applied during entering/leaving phase.
 * @param transitionOut A manual toggle to trigger the transition.
 * @param appear Whether to apply the transition on initial render.
 * @constructor
 */
export function Transition({ children, from, to, active, transitionOut, appear }: TransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transitionedIn, setTransitionedIn] = useState(false);
  const [isActive, setIsActive] = useState(appear ?? false);

  // Necessary for triggering initial transition
  useEffect(() => {
    setTransitionedIn(true);
  }, []);

  useEffect(() => {
    if (transitionOut) {
      setTransitionedIn(false);
    } else {
      setTransitionedIn(true);
    }
  }, [transitionOut]);

  // This effect is responsible for applying the active styles
  // if "appear" parameter is set to false
  useEffect(() => {
    if (isActive) return;

    if (!!children) {
      setIsActive(true);
    }
  }, [children]);

  return (
    <div
      ref={ref}
      className={clsx({
        [active]: isActive,
        [from]: !transitionedIn,
        [to]: transitionedIn,
      })}
    >
      {children}
    </div>
  );
}
