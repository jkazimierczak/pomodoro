import { ComponentProps, forwardRef, useImperativeHandle, useRef } from "react";
import { UnstyledNumberInput } from "./UnstyledNumberInput";

interface InputTile extends ComponentProps<"input"> {}

export const InputTile = forwardRef<HTMLInputElement, InputTile>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  return (
    <UnstyledNumberInput
      ref={inputRef}
      className="w-9 rounded bg-neutral-200 py-0.5 text-neutral-100 dark:bg-neutral-800"
      inputClassName="text-neutral-900 dark:text-neutral-100"
      {...props}
    />
  );
});
