import React, {
  ComponentProps,
  forwardRef,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { Portal } from "../Portal";
import clsx from "clsx";
import { Fade } from "../Transitions";

export interface ModalProps extends ComponentProps<"div"> {
  children: ReactElement;
  isOpen: boolean;
  onClose: () => void;
  closeAfterTransition?: boolean;
  placement?: "center" | "top" | "right" | "bottom" | "left";
}

function isChildrenATransition(children: ReactNode) {
  if (!React.isValidElement(children)) return false;

  return Object.prototype.hasOwnProperty.call(children.props, "in");
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ children, isOpen, onClose, closeAfterTransition, placement, ...props }, forwardedRef) => {
    const [isExited, setIsExited] = useState(!isOpen);
    const hasTransition = isChildrenATransition(children);

    function handleEnter() {
      setIsExited(false);
    }

    function handleExited() {
      setIsExited(true);

      if (closeAfterTransition) {
        onClose();
      }
    }

    const childProps: {
      onEnter?: () => void;
      onExited?: () => void;
    } = {};
    if (hasTransition) {
      childProps.onEnter = handleEnter;
      childProps.onExited = handleExited;
    }

    if (!isOpen && (!hasTransition || isExited)) {
      return null;
    }

    const backdrop = (
      <div
        className="fixed inset-0 cursor-pointer bg-black bg-opacity-70 backdrop-blur-sm"
        style={{ WebkitTapHighlightColor: "transparent" }}
        // This has to be onClose instead of handleExited
        // otherwise the exit transition isn't triggered
        onClick={onClose}
      />
    );

    return (
      <Portal>
        <div ref={forwardedRef}>
          {/*  Backdrop  */}
          {hasTransition ? (
            <Fade in={isOpen} appear>
              {backdrop}
            </Fade>
          ) : (
            backdrop
          )}
          {/*  Content  */}
          <div
            className={clsx({
              absolute: true,
              "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2":
                !placement || placement == "center",
              "left-1/2 top-0 -translate-x-1/2": placement == "top",
              "right-0 top-1/2 -translate-y-1/2 max-[440px]:left-0": placement == "right",
              "bottom-0 left-1/2 -translate-x-1/2": placement == "bottom",
              "left-0 top-1/2 -translate-y-1/2  max-[440px]:right-0": placement == "left",
            })}
          >
            {React.cloneElement(children, childProps)}
          </div>
        </div>
      </Portal>
    );
  }
);
