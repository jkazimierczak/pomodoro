import { ComponentProps, ForwardedRef, forwardRef } from "react";

interface RangeInput extends ComponentProps<"input"> {}

function _RangeInput(props: RangeInput, ref: ForwardedRef<HTMLInputElement>) {
  return (
    <div className={"flex items-center"}>
      <span className="mr-5 w-10">{props.value}</span>
      <span className="mr-2.5">{props.min}</span>
      <input className="mr-2.5 grow" type="range" ref={ref} {...props} />
      <span className="w-10">{props.max}</span>
    </div>
  );
}

export const RangeInput = forwardRef<HTMLInputElement, RangeInput>(_RangeInput);
