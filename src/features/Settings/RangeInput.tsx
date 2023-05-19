import { ChangeEvent, ComponentProps, useEffect, useRef, useState } from "react";
import { Simulate } from "react-dom/test-utils";
import input = Simulate.input;

interface RangeInput extends ComponentProps<"input"> {}

export function RangeInput({ ...props }: RangeInput) {
  const [value, setValue] = useState(props.value);
  const inputRef = useRef<HTMLInputElement>(null);

  function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.currentTarget.value);
  }

  return (
    <div className={"flex items-center"}>
      <span className="mr-5 w-10">{value}</span>
      <span className="mr-2.5">{props.min}</span>
      <input
        className="mr-2.5 grow"
        type="range"
        {...props}
        ref={inputRef}
        onChange={onChangeHandler}
      />
      <span className="w-10">{props.max}</span>
    </div>
  );
}
