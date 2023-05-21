import { ReactNode } from "react";
import ReactDOM from "react-dom";
import "./Portal.css";

interface Portal {
  children: ReactNode;
  isOpen: boolean;
}

export function Portal({ children, isOpen }: Portal) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div className="portal__overlay"></div>
      <div className="portal right-0 top-0 h-full">{children}</div>
    </>,
    // @ts-ignore
    document.querySelector("#modal")
  );
}
