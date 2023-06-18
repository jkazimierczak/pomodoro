import { ComponentProps, forwardRef, useImperativeHandle, useRef } from "react";

interface InputTileProps extends ComponentProps<"input"> {}

export const InputTile = forwardRef<HTMLInputElement, InputTileProps>(({ ...props }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  function focusInput() {
    if (!inputRef.current) return;

    inputRef.current.select();
  }

  return (
    <div
      className="w-9 rounded bg-neutral-200 py-0.5 text-neutral-100 dark:bg-neutral-800"
      onClick={focusInput}
    >
      <input
        type="number"
        ref={inputRef}
        className="border-none bg-transparent p-0 text-center text-neutral-900 [appearance:textfield] focus:ring-0 dark:text-neutral-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        {...props}
      />
    </div>
  );
});
