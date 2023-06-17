import { ComponentProps, useEffect } from "react";
import { IconContext } from "react-icons";
import { FiRotateCcw, FiSave, FiX } from "react-icons/fi";
import { FormSection } from "@/features/Settings/FormSection";
import { RangeInput } from "@/features/Settings/RangeInput";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultSettings, SettingsFormData, settingsSchema } from "@/features/Settings/schema";
import { useAppDispatch, useAppSelector } from "@/app";
import { updateSettings } from "@/features/Settings/settingsSlice";
import { setNextMidnight } from "@/app/appSlice";
import { getNextMidnightFromString } from "@/common/helpers";
import { isDarkMode, setTheme, Theme } from "@/common/darkMode";
import clsx from "clsx";

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
          <p className="mb-1 dark:text-neutral-300">Session duration</p>
          <Controller
            control={control}
            name="sessionDuration"
            render={({ field }) => <RangeInput min={1} max={120} {...field} />}
          />
          <p className="mb-1 dark:text-neutral-300">Break duration</p>
          <Controller
            control={control}
            name="breakDuration"
            render={({ field }) => <RangeInput min={1} max={60} {...field} />}
          />
          <p className="mb-1 dark:text-neutral-300">Long break duration</p>
          <Controller
            control={control}
            name="longBreakDuration"
            render={({ field }) => <RangeInput min={1} max={60} {...field} />}
          />
        </FormSection>

        <FormSection title="Other">
          <p className="mb-1 dark:text-neutral-300">Sessions before long break</p>
          <Controller
            control={control}
            name="sessionsBeforeLongBreak"
            render={({ field }) => <RangeInput min={1} max={10} {...field} />}
          />
          <p className="mb-1 dark:text-neutral-300">Daily goal</p>
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
            <input
              type="time"
              id="startNewDayAt"
              {...register("startNewDayAt")}
              className="dark:bg-neutral-900"
            />
          </div>
          <div className={"mt-2 flex justify-between"}>
            <label htmlFor="startNewDayAt">Theme</label>
            <div className="flex divide-x rounded border-2 dark:divide-neutral-600 dark:border-neutral-600">
              <button
                className={clsx({
                  "rounded-l-sm px-4 transition-colors": true,
                  "bg-sky-500": !isDarkMode(),
                })}
                onClick={() => setTheme(Theme.LIGHT)}
              >
                Light
              </button>
              <button
                className={clsx({
                  "rounded-r-sm px-4 transition-colors": true,
                  "bg-sky-500": isDarkMode(),
                })}
                onClick={() => setTheme(Theme.DARK)}
              >
                Dark
              </button>
            </div>
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
