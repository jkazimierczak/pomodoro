import { MouseEventHandler, ReactNode } from "react";
import ReactDOM from "react-dom";

interface Portal {
  children: ReactNode;
  isOpen: boolean;
  close: MouseEventHandler<HTMLDivElement>;
}

export function Portal({ children, isOpen, close }: Portal) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div
        className="fixed bottom-0 left-0 right-0 top-0 bg-black bg-opacity-70"
        onClick={close}
      ></div>
      <div className="z-50">{children}</div>
    </>,
    document.querySelector("#modal") as HTMLElement
  );
}
