import { MouseEventHandler, ReactNode } from "react";
import ReactDOM from "react-dom";
import "./Portal.css";

interface Portal {
  children: ReactNode;
  isOpen: boolean;
  close: MouseEventHandler<HTMLDivElement>;
}

export function Portal({ children, isOpen, close }: Portal) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div className="portal__overlay" onClick={close}></div>
      <div className="portal right-0 top-0 h-full">{children}</div>
    </>,
    document.querySelector("#modal") as HTMLElement
  );
}
