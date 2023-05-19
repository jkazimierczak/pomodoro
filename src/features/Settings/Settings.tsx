import { ComponentProps } from "react";
import { IconContext } from "react-icons";
import { FiX } from "react-icons/fi";
import { FormSection } from "@/features/Settings/FormSection";
import { RangeInput } from "@/features/Settings/RangeInput";

interface Settings extends ComponentProps<"form"> {}

export function Settings({ ...params }: Settings) {
  return (
    <form {...params}>
      <header className="between mb-4 flex justify-between">
        <p className="text-4xl">Settings</p>
        <button>
          <IconContext.Provider value={{ size: "2.25em" }}>
            <FiX />
          </IconContext.Provider>
        </button>
      </header>

      <FormSection title="General">
        <p>Session duration</p>
        <RangeInput min={1} max={120} />
        <p>Break duration</p>
        <RangeInput min={1} max={60} />
        <p>Long break duration</p>
        <RangeInput min={1} max={60} />
        <p>Sessions before long break</p>
        <RangeInput min={1} max={10} />
      </FormSection>
    </form>
  );
}
