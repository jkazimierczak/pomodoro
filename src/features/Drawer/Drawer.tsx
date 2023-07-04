import React, { ComponentProps, forwardRef, ReactElement } from "react";
import { Modal, ModalProps } from "../Modal";
import { Slide } from "../Transitions";

export interface DrawerProps extends ComponentProps<"div">, Omit<ModalProps, "children"> {
  children: ReactElement;
  isOpen: boolean;
  onClose: () => void;
  placement: "top" | "right" | "bottom" | "left";
}

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  ({ children, isOpen, onClose, placement }, forwardedRef) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose} placement={placement}>
        <Slide in={isOpen} from={placement} appear>
          {children}
        </Slide>
      </Modal>
    );
  }
);
