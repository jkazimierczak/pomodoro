import { ReactElement } from "react";

export type Callback = () => void;

export interface TransitionProps {
  addEndListener?: Callback;
  children: ReactElement;
  appear?: boolean;
  in: boolean;
  onEnter?: Callback;
  onEntered?: Callback;
  onEntering?: Callback;
  onExit?: Callback;
  onExited?: Callback;
  onExiting?: Callback;
  // timeout:
  //   | number
  //   | {
  //       appear: number;
  //       enter: number;
  //       exit: number;
  //     };
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
}
