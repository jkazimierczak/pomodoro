import { ComponentProps, forwardRef } from "react";

interface InputNumberProps extends ComponentProps<"input"> {}

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(({ ...props }, ref) => {
  return (
    <div className="w-10 rounded bg-neutral-200 py-0.5 text-neutral-100 dark:bg-neutral-800">
      <input
        type="number"
        ref={ref}
        className="w-full border-none bg-transparent p-0 text-center text-neutral-900 [appearance:textfield] focus:ring-0 dark:text-neutral-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        {...props}
      />
    </div>
  );
});
