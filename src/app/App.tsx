import { Timer } from "@/features/Timer";
import { Settings } from "@/features/Settings/Settings";
import { Portal, usePortal } from "@/features/Portal";
import { FiBell, FiBellOff, FiMoon, FiSettings, FiSun } from "react-icons/all";
import { IconContext } from "react-icons";
import { useAppDispatch, useAppSelector } from "../store";
import { PomodoroStatus } from "@/features/Timer/timerSlice";
import { updateSettings } from "@/features/Settings/settingsSlice";
import { isDarkMode, toggleTheme } from "@/common/darkMode";
import { useState } from "react";
import clsx from "clsx";

export function App() {
  const { isOpen, openPortal, closePortal } = usePortal(true);
  const timerStatus = useAppSelector((state) => state.timer.status);
  const appSettings = useAppSelector((state) => state.settings);
  const isSoundEnabled = useAppSelector((state) => state.settings.canPlaySound);
  const dispatch = useAppDispatch();
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(isDarkMode());

  const isStarted = timerStatus !== PomodoroStatus.UNSTARTED;

  function toggleSound() {
    dispatch(updateSettings({ ...appSettings, canPlaySound: !isSoundEnabled }));
  }

  function toggleAppTheme() {
    toggleTheme();
    setIsDarkModeEnabled(isDarkMode());
  }

  return (
    <div className="relative grid h-screen justify-center transition-colors dark:bg-neutral-900">
      <Timer
        className="absolute left-1/2 top-1/2"
        style={{
          transform: "translate(-50%, -50%)",
        }}
      />

      <>
        <div className="absolute right-0 top-0 m-6 flex gap-4">
          <IconContext.Provider
            value={{ size: "1.75em", className: "text-neutral-900 dark:text-neutral-300" }}
          >
            <button onClick={toggleAppTheme}>{isDarkModeEnabled ? <FiSun /> : <FiMoon />}</button>
            <button onClick={toggleSound}>{isSoundEnabled ? <FiBell /> : <FiBellOff />}</button>
            <IconContext.Provider
              value={{
                size: "1.75em",
                className: clsx({
                  "text-neutral-900 transition-colors dark:text-neutral-300": true,
                  "!text-neutral-200 dark:!text-neutral-700": isStarted,
                }),
              }}
            >
              <button onClick={openPortal} disabled={isStarted}>
                <FiSettings />
              </button>
            </IconContext.Provider>
          </IconContext.Provider>
        </div>
        <Portal isOpen={isOpen} close={closePortal}>
          <Settings
            className="absolute right-0 top-0 h-full w-screen bg-white p-5 shadow shadow-gray-700 transition-colors dark:bg-neutral-900 dark:text-neutral-200 sm:w-[440px]"
            onClose={closePortal}
          />
        </Portal>
      </>
    </div>
  );
}
