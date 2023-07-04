import { ComponentProps, forwardRef, useImperativeHandle, useRef } from "react";

interface LargeInputTileProps extends ComponentProps<"input"> {
  title: string;
}

export const LargeInputTile = forwardRef<HTMLInputElement, LargeInputTileProps>(
  ({ title, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    function focusInput() {
      if (!inputRef.current) return;

      inputRef.current.select();
    }

    return (
      <div
        className="flex w-full flex-col justify-center rounded bg-sky-500 py-3 text-neutral-100"
        onClick={focusInput}
      >
        <label className="mb-1 text-center text-sm font-light uppercase">{title}</label>
        <input
          type="number"
          enterKeyHint="done"
          ref={inputRef}
          inputMode="decimal"
          className="border-none bg-transparent p-0 text-center text-3xl font-medium [appearance:textfield] focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          {...props}
        />
      </div>
    );
  }
);
