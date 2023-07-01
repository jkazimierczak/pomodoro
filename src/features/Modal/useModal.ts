import { useState } from "react";

export function useModal(initiallyOpen: boolean) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return { isOpen, open, close };
}
