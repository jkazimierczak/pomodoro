import React, { ReactElement } from "react";

export type Callback = () => void;

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
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
}

type Exclusive = { key: React.Key; in?: never } | { key?: never; in: boolean };
export type TransitionProps = Exclusive & BaseProps;
