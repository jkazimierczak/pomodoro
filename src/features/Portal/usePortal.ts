import { useState } from "react";

export function usePortal(initiallyOpen: boolean) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  function openPortal() {
    setIsOpen(true);
  }

  function closePortal() {
    setIsOpen(false);
  }

  return { isOpen, openPortal, closePortal };
}
