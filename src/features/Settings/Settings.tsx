import { ComponentProps, useEffect } from "react";
import { IconContext } from "react-icons";
import { FiSettings, FiRotateCcw, FiSave, FiX } from "react-icons/fi";
import { FormSection } from "@/features/Settings/FormSection";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultSettings, SettingsFormData, settingsSchema } from "@/features/Settings/schema";
import { useAppDispatch, useAppSelector } from "@/app";
import { updateSettings } from "@/features/Settings/settingsSlice";
import { setNextMidnight } from "@/app/appSlice";
import { getNextMidnightFromString } from "@/common/helpers";
import { isDarkMode, setTheme, Theme } from "@/common/darkMode";
import { LargeInputTile } from "@/features/Settings/Inputs/LargeInputTile";
import clsx from "clsx";
import { InputTile } from "@/features/Settings/Inputs/InputTile";
import { UnstyledNumberInput } from "@/features/Settings/Inputs/UnstyledNumberInput";

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
    const nextMidnight = getNextMidnightFromString(defaultSettings.startNewDayAt).toString();

    dispatch(updateSettings(defaultSettings));
    dispatch(setNextMidnight(nextMidnight));
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
        <header className="between flex justify-between">
          <IconContext.Provider value={{ size: "1.75em" }}>
            <div className="flex items-center gap-2">
              <FiSettings />
              <p className="text-3xl font-medium">Settings</p>
            </div>

            <div className="flex gap-2">
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

        <FormSection title="Durations">
          <div className="flex gap-2.5">
            <Controller
              control={control}
              name="sessionDuration"
              render={({ field }) => (
                <LargeInputTile title="Pomodoro" min={1} max={120} size={3} {...field} />
              )}
            />
            <Controller
              control={control}
              name="breakDuration"
              render={({ field }) => (
                <LargeInputTile title="Break" min={1} max={60} size={3} {...field} />
              )}
            />
            <Controller
              control={control}
              name="longBreakDuration"
              render={({ field }) => (
                <LargeInputTile title="Long break" min={1} max={60} size={3} {...field} />
              )}
            />
          </div>
        </FormSection>

        <FormSection title="Other">
          <div className="mb-2.5 flex items-center justify-between">
            <p className="dark:text-neutral-300">Sessions before long break</p>
            <Controller
              control={control}
              name="sessionsBeforeLongBreak"
              render={({ field }) => <InputTile min={1} max={10} size={2} {...field} />}
            />
          </div>
          <div className="mb-2.5 flex items-center justify-between">
            <p className="dark:text-neutral-300">Daily goal</p>
            <Controller
              control={control}
              name="dailyGoal"
              render={({ field }) => <InputTile min={1} max={16} size={2} {...field} />}
            />
          </div>
          <div className="mb-2.5 flex items-center justify-between">
            <label htmlFor="canPlaySound">Play sound when session ends</label>
            <input type="checkbox" id="canPlaySound" {...register("canPlaySound")} />
          </div>
          <div className="mb-2.5 flex items-center justify-between">
            <label htmlFor="startNewDayAt">Start next day at</label>
            <input
              type="time"
              id="startNewDayAt"
              {...register("startNewDayAt")}
              className="border-0 p-0 dark:bg-neutral-900"
            />
          </div>
          <div className="mb-2.5 flex items-center justify-between">
            <p className="dark:text-neutral-300">Theme</p>
            <div className="text-md flex rounded border border-neutral-300 dark:border-neutral-700">
              <button
                className={clsx({
                  "rounded-l-sm px-4 transition-colors": true,
                  "bg-sky-500 text-neutral-100": !isDarkMode(),
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
        </FormSection>

        <FormSection title="Danger zone">
          <p className={"flex items-center gap-2 hover:cursor-pointer"} onClick={restoreDefault}>
            <FiRotateCcw /> Restore default settings
          </p>
        </FormSection>
      </form>
    </>
  );
}
