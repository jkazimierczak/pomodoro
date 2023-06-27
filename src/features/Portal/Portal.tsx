import { MouseEventHandler, ReactNode } from "react";
import ReactDOM from "react-dom";
import { Transition } from "@/features/Transition";

interface Portal {
  children: ReactNode;
  delayedIsOpen: boolean;
  isOpen: boolean;
  close: MouseEventHandler<HTMLDivElement>;
}

export function Portal({ children, delayedIsOpen, isOpen, close }: Portal) {
  if (!delayedIsOpen) return null;

  return ReactDOM.createPortal(
    <>
      <Transition
        from="opacity-0"
        to="opacity-70"
        active="transition-opacity duration-300"
        appear
        transitionOut={!isOpen}
      >
        <div className="fixed bottom-0 left-0 right-0 top-0 bg-black" onClick={close} />
      </Transition>
      <div className="z-50">{children}</div>
    </>,
    document.querySelector("#modal") as HTMLElement
  );
}
