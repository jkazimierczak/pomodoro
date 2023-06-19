import { ComponentProps, FormEvent, useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { FiCheck, FiRotateCcw, FiSave, FiSettings, FiX } from "react-icons/fi";
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
import { InputNumber, LargeInputTile } from "./Inputs";
import clsx from "clsx";

interface Settings extends ComponentProps<"form"> {
  onClose: () => void;
}

export function Settings({ onClose, ...params }: Settings) {
  const dispatch = useAppDispatch();
  const settingsState = useAppSelector((state) => state.settings);

  const [selectedTheme, setSelectedTheme] = useState(isDarkMode() ? Theme.DARK : Theme.LIGHT);
  const [confirmRestore, setConfirmRestore] = useState(false);

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

  function selectTheme(e: FormEvent<HTMLButtonElement>, theme: Theme) {
    e.preventDefault();

    setTheme(theme);
    setSelectedTheme(theme);
  }

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
            <label htmlFor="sessionsBeforeLongBreak">Sessions before long break</label>
            <Controller
              control={control}
              name="sessionsBeforeLongBreak"
              render={({ field }) => (
                <InputNumber
                  id="sessionsBeforeLongBreak"
                  min={1}
                  max={10}
                  size={2}
                  {...field}
                  onClick={(event) => event.currentTarget.select()}
                />
              )}
            />
          </div>
          <div className="mb-2.5 flex items-center justify-between">
            <label htmlFor="dailyGoal">Daily goal</label>
            <Controller
              control={control}
              name="dailyGoal"
              render={({ field }) => (
                <InputNumber
                  id="dailyGoal"
                  min={1}
                  max={10}
                  size={2}
                  {...field}
                  onClick={(event) => event.currentTarget.select()}
                />
              )}
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
              className="max-w-max border-0 p-0 text-right dark:bg-neutral-900"
              onKeyDown={(event) => event.key === "Enter" && event.currentTarget.blur()}
            />
          </div>
          <div className="mb-2.5 flex items-center justify-between">
            <p>Theme</p>
            <div className="text-md flex rounded border border-neutral-300 dark:border-neutral-700">
              <button
                className={clsx({
                  "rounded-l-sm px-4 transition-colors": true,
                  "bg-sky-500 text-neutral-100": selectedTheme === Theme.LIGHT,
                })}
                onClick={(e) => selectTheme(e, Theme.LIGHT)}
              >
                Light
              </button>
              <button
                className={clsx({
                  "rounded-r-sm px-4 transition-colors": true,
                  "bg-sky-500": selectedTheme === Theme.DARK,
                })}
                onClick={(e) => selectTheme(e, Theme.DARK)}
              >
                Dark
              </button>
            </div>
          </div>
        </FormSection>

        <FormSection title="Danger zone">
          <IconContext.Provider value={{ size: "1em" }}>
            {!confirmRestore ? (
              <p
                className={"flex items-center gap-2 hover:cursor-pointer"}
                onClick={() => setConfirmRestore(true)}
              >
                <FiRotateCcw /> Restore default settings
              </p>
            ) : (
              <div className="mb-2.5 flex items-center justify-between">
                <p className="">Are you sure?</p>
                <div className="text-md flex rounded border border-neutral-300 dark:border-neutral-700">
                  <button
                    className={clsx({
                      "box-border flex w-20 items-center gap-2 rounded-l-sm px-4 transition-colors":
                        true,
                      "bg-sky-500 text-neutral-100": selectedTheme === Theme.LIGHT,
                    })}
                    onClick={() => {
                      restoreDefault();
                      setConfirmRestore(false);
                    }}
                  >
                    <span>
                      <FiCheck />
                    </span>
                    Yes
                  </button>
                  <button
                    className={clsx({
                      "box-border flex w-20 items-center gap-2 rounded-r-sm px-4 transition-colors":
                        true,
                      "bg-sky-500": selectedTheme === Theme.DARK,
                    })}
                    onClick={() => setConfirmRestore(false)}
                  >
                    <span>
                      <FiX />
                    </span>
                    No
                  </button>
                </div>
              </div>
            )}
          </IconContext.Provider>
        </FormSection>
      </form>
    </>
  );
}
