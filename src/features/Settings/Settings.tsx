import React, { ComponentProps, FormEvent, forwardRef, useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FiCheck, FiRotateCcw, FiSave, FiSettings, FiX } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/app";
import { updateSettings, defaultSettings, SettingsFormData, settingsSchema, FormSection } from ".";
import { InputNumber, LargeInputTile } from "./Inputs";
import { isDarkMode, setTheme, Theme } from "@/common/darkMode";
import clsx from "clsx";
import { SwitchTransition } from "react-transition-group";
import { Fade, Slide } from "@/features/Transitions";
import { durationToHoursMinutes } from "@/common";
import { Temporal } from "@js-temporal/polyfill";

interface Settings extends ComponentProps<"form"> {
  onClose: () => void;
}

export const Settings = forwardRef<HTMLFormElement, Settings>(({ onClose, ...params }, forwardedRef) => {
  const dispatch = useAppDispatch();
  const settingsState = useAppSelector((state) => state.settings);

  const [selectedTheme, setSelectedTheme] = useState(isDarkMode() ? Theme.DARK : Theme.LIGHT);
  const [confirmRestore, setConfirmRestore] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, isSubmitSuccessful },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: defaultSettings,
  });

  const sessionDurationWatch = watch("sessionDuration");
  const dailyGoalWatch = watch("dailyGoal");

  const totalTimeToFocusDuration = Temporal.Duration.from({
    minutes: sessionDurationWatch * dailyGoalWatch,
  });
  const totalTimeToFocus =
    sessionDurationWatch < 0
      ? "(￣︿￣ *)"
      : durationToHoursMinutes(totalTimeToFocusDuration) || "¯\\_(ツ)_/¯";

  function restoreDefault() {
    dispatch(updateSettings(defaultSettings));
    reset(defaultSettings);
  }

  const onSubmit: SubmitHandler<SettingsFormData> = (data) => {
    dispatch(updateSettings(data));
  };

  useEffect(() => {
    reset(settingsState);
  }, [isSubmitSuccessful]);

  function selectTheme(e: FormEvent<HTMLButtonElement>, theme: Theme) {
    e.preventDefault();

    setTheme(theme);
    setSelectedTheme(theme);
  }

  function blurOnEnterKey(event: React.KeyboardEvent<HTMLInputElement>) {
    event.key === "Enter" && event.currentTarget.blur();
  }

  return (
    <>
      {import.meta.env.DEV && <DevTool control={control} placement="top-left" />}

      <form {...params} onSubmit={handleSubmit(onSubmit)} ref={forwardedRef}>
        <header className="between flex justify-between">
          <IconContext.Provider value={{ size: "1.75em" }}>
            <div className="flex items-center gap-2">
              <FiSettings />
              <p className="text-3xl font-medium">Settings</p>
            </div>

            <SwitchTransition>
              <Slide key={Number(isDirty)} from="left">
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
              </Slide>
            </SwitchTransition>
          </IconContext.Provider>
        </header>

        <FormSection title="Durations">
          <div className="flex gap-2.5">
            <Controller
              control={control}
              name="sessionDuration"
              render={({ field }) => (
                <LargeInputTile
                  title="Pomodoro"
                  min={1}
                  max={120}
                  size={3}
                  {...field}
                  onKeyDown={blurOnEnterKey}
                />
              )}
            />
            <Controller
              control={control}
              name="breakDuration"
              render={({ field }) => (
                <LargeInputTile
                  title="Break"
                  min={1}
                  max={60}
                  size={3}
                  {...field}
                  onKeyDown={blurOnEnterKey}
                />
              )}
            />
            <Controller
              control={control}
              name="longBreakDuration"
              render={({ field }) => (
                <LargeInputTile
                  title="Long break"
                  min={1}
                  max={60}
                  size={3}
                  {...field}
                  onKeyDown={blurOnEnterKey}
                />
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
                  onKeyDown={blurOnEnterKey}
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
                  onKeyDown={blurOnEnterKey}
                />
              )}
            />
          </div>
          <div className="mb-2.5 flex select-none items-center justify-between text-neutral-500">
            <p>Total time to focus</p>
            <p>{totalTimeToFocus}</p>
          </div>
          <hr className="my-2.5 w-full border-neutral-300 dark:border-neutral-700" />
          <div className="mb-2.5 flex items-center justify-between">
            <label htmlFor="autoStartBreaks">Auto start breaks</label>
            <input type="checkbox" id="autoStartBreaks" {...register("autoStartBreaks")} />
          </div>
          <div className="mb-2.5 flex items-center justify-between">
            <label htmlFor="autoStartSessions">Auto start sessions</label>
            <input type="checkbox" id="autoStartSessions" {...register("autoStartSessions")} />
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
              onKeyDown={blurOnEnterKey}
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
            <SwitchTransition>
              <Fade key={Number(confirmRestore)}>
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
              </Fade>
            </SwitchTransition>
          </IconContext.Provider>
        </FormSection>
      </form>
    </>
  );
});
