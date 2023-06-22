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
import { setNextMidnight } from "@/appSlice";
import { getNextMidnightFromString } from "@/store/helpers";

interface Settings extends ComponentProps<"form"> {
  onClose: () => void;
}

export function Settings({ onClose, ...params }: Settings) {
  const dispatch = useAppDispatch();
  const settingsState = useAppSelector((state) => state.settings);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitSuccessful },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: defaultSettings,
  });

  function restoreDefault() {
    dispatch(updateSettings(defaultSettings));
    reset(defaultSettings);
  }

  const onSubmit: SubmitHandler<SettingsFormData> = (data) => {
    const nextMidnight = getNextMidnightFromString(data.startNewDayAt).toString();

    dispatch(updateSettings(data));
    dispatch(setNextMidnight(nextMidnight));
  };

  useEffect(() => {
    reset(settingsState);
  }, [isSubmitSuccessful]);

  return (
    <>
      {import.meta.env.DEV && <DevTool control={control} placement="top-left" />}

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
              {!isDirty && (
                <button onClick={onClose}>
                  <FiX />
                </button>
              )}
            </div>
          </IconContext.Provider>
        </header>

        <FormSection title="General">
          <p className="mb-1">Session duration</p>
          <Controller
            control={control}
            name="sessionDuration"
            render={({ field }) => <RangeInput min={1} max={120} {...field} />}
          />
          <p className="mb-1">Break duration</p>
          <Controller
            control={control}
            name="breakDuration"
            render={({ field }) => <RangeInput min={1} max={60} {...field} />}
          />
          <p className="mb-1">Long break duration</p>
          <Controller
            control={control}
            name="longBreakDuration"
            render={({ field }) => <RangeInput min={1} max={60} {...field} />}
          />
        </FormSection>

        <FormSection title="Other">
          <p className="mb-1">Sessions before long break</p>
          <Controller
            control={control}
            name="sessionsBeforeLongBreak"
            render={({ field }) => <RangeInput min={1} max={10} {...field} />}
          />
          <p className="mb-1">Daily goal</p>
          <Controller
            control={control}
            name="dailyGoal"
            render={({ field }) => <RangeInput min={1} max={16} {...field} />}
          />
          <div className={"mt-2 flex justify-between"}>
            <label htmlFor="canPlaySound">Play sound when session ends</label>
            <input type="checkbox" id="canPlaySound" {...register("canPlaySound")} />
          </div>
          <div className={"mt-2 flex justify-between"}>
            <label htmlFor="startNewDayAt">Start next day at</label>
            <input type="time" id="startNewDayAt" {...register("startNewDayAt")} />
          </div>

          <p
            className={"mt-4 flex items-center gap-2 hover:cursor-pointer"}
            onClick={restoreDefault}
          >
            <FiRotateCcw /> Restore default settings
          </p>
        </FormSection>
      </form>
    </>
  );
}
