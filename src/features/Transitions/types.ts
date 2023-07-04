import React, { ReactElement } from "react";

export type Callback = () => void;

export type TransitionSpeed = "fast" | "faster";

export interface BaseProps {
  addEndListener?: Callback;
  children: ReactElement;
  appear?: boolean;
  onEnter?: Callback;
  onEntered?: Callback;
  onEntering?: Callback;
  onExit?: Callback;
  onExited?: Callback;
  onExiting?: Callback;
  speed?: TransitionSpeed;
  timeout?:
    | number
    | {
        appear?: number;
        enter?: number;
        exit?: number;
      };
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
}

export type TransitionTrigger =
  | {
      key: React.Key;
      in?: never;
    }
  | {
      key?: never;
      in: boolean;
    };

export type TransitionProps = TransitionTrigger & BaseProps;
