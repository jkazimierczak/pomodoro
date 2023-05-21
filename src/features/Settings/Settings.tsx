import { ComponentProps, useEffect } from "react";
import { IconContext } from "react-icons";
import { FiRotateCcw, FiSave, FiX } from "react-icons/fi";
import { FormSection } from "@/features/Settings/FormSection";
import { RangeInput } from "@/features/Settings/RangeInput";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultSettings, SettingsFormData, settingsSchema } from "@/features/Settings/schema";
import { useAppDispatch, useAppSelector } from "@/store";
import { updateSettings } from "@/features/Settings/settingsSlice";

interface Settings extends ComponentProps<"form"> {}

export function Settings({ ...params }: Settings) {
  const dispatch = useAppDispatch();
  const settingsState = useAppSelector((state) => state.settings);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitSuccessful },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: defaultSettings,
  });

  const onSubmit: SubmitHandler<SettingsFormData> = (data) => {
    dispatch(updateSettings(data));
  };

  useEffect(() => {
    reset(settingsState);
  }, [isSubmitSuccessful]);

  return (
    <>
      <DevTool control={control} placement="top-left" />

      <form {...params} onSubmit={handleSubmit(onSubmit)}>
        <header className="between mb-4 flex justify-between">
          <p className="text-4xl">Settings</p>
          <IconContext.Provider value={{ size: "2.25em" }}>
            <div className="flex gap-5">
              {isDirty && (
                <button onClick={() => reset({ ...settingsState })}>
                  <FiRotateCcw />
                </button>
              )}
              {isDirty && (
                <button type="submit">
                  <FiSave />
                </button>
              )}
              <button>
                <FiX />
              </button>
            </div>
          </IconContext.Provider>
        </header>

        <FormSection title="General">
          <p>Session duration</p>
          <Controller
            control={control}
            name="sessionDuration"
            render={({ field }) => <RangeInput min={1} max={120} {...field} />}
          />
          <p>Break duration</p>
          <Controller
            control={control}
            name="breakDuration"
            render={({ field }) => <RangeInput min={1} max={60} {...field} />}
          />
          <p>Long break duration</p>
          <Controller
            control={control}
            name="longBreakDuration"
            render={({ field }) => <RangeInput min={1} max={60} {...field} />}
          />
          <p>Sessions before long break</p>
          <Controller
            control={control}
            name="sessionsBeforeLongBreak"
            render={({ field }) => <RangeInput min={1} max={10} {...field} />}
          />
        </FormSection>
      </form>
    </>
  );
}
