import React, { cloneElement, ComponentProps, forwardRef, ReactNode } from "react";
import ReactDOM from "react-dom";

interface PortalProps extends ComponentProps<"div"> {
  children: ReactNode;
}

export const Portal = forwardRef<HTMLDivElement, PortalProps>(({ children }, forwardedRef) => {
  return ReactDOM.createPortal(
    cloneElement(children as React.ReactElement, { ref: forwardedRef }),
    document.querySelector("#portal") as Element
  );
});
