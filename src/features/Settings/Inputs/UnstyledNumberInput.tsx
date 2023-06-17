import { ComponentProps, forwardRef, useImperativeHandle, useRef } from "react";

export interface UnstyledNumberInput extends ComponentProps<"input"> {
  className: string;
  inputClassName: string;
  title?: string;
}

export const UnstyledNumberInput = forwardRef<HTMLInputElement, UnstyledNumberInput>(
  ({ className, inputClassName, title, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const _inputClassName = `border-none bg-transparent p-0 text-center [appearance:textfield] focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${inputClassName}`;

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    function focusInput() {
      if (!inputRef.current) return;

      inputRef.current.focus();
    }

    return (
      <div className={className} onClick={focusInput}>
        {title && <label className="mb-1 text-center text-sm font-light uppercase">{title}</label>}
        <input type="number" ref={inputRef} className={_inputClassName} {...props} />
      </div>
    );
  }
);
