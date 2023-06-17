import { ComponentProps, forwardRef, useImperativeHandle, useRef } from "react";
import { UnstyledNumberInput } from "./UnstyledNumberInput";

interface LargeInputTile extends ComponentProps<"input"> {
  title?: string;
}

export const LargeInputTile = forwardRef<HTMLInputElement, LargeInputTile>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  function focusInput() {
    if (!inputRef.current) return;

    inputRef.current.focus();
  }

  return (
    <UnstyledNumberInput
      ref={inputRef}
      inputClassName="text-3xl font-medium"
      className="flex w-full flex-col justify-center rounded bg-sky-500 py-3 text-neutral-100"
      {...props}
    />
  );
});
