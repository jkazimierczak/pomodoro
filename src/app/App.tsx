import { Timer, PomodoroStatus } from "@/features/Timer";
import { Settings, updateSettings } from "@/features/Settings";
import { Portal } from "@/features/Portal";
import { FiBarChart2, FiBell, FiBellOff, FiMoon, FiSettings, FiSun } from "react-icons/all";
import { IconContext } from "react-icons";
import { isDarkMode, toggleTheme } from "@/common/darkMode";
import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { loadFull } from "tsparticles";
import type { Container, Engine } from "tsparticles-engine";
import type { EmitterContainer } from "tsparticles-plugin-emitters";
import Particles from "react-tsparticles";
import { confettiConfig, confettiEmitter, resetDailyGoal, useAppDispatch, useAppSelector } from ".";
import { Stats } from "@/features/Stats";
import { useModal } from "@/features/Modal";
import { Drawer } from "@/features/Drawer";

export function App() {
  const containerRef = useRef<Container | null>(null);
  const settings = useModal(false);
  const stats = useModal(false);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(isDarkMode());

  const timerStatus = useAppSelector((state) => state.timer.status);
  const appSettings = useAppSelector((state) => state.settings);
  const isSoundEnabled = useAppSelector((state) => state.settings.canPlaySound);
  const finishedDailyGoal = useAppSelector((state) => state.app.finishedDailyGoal);
  const dispatch = useAppDispatch();

  const isStarted = timerStatus !== PomodoroStatus.UNSTARTED;

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  function toggleSound() {
    dispatch(updateSettings({ ...appSettings, canPlaySound: !isSoundEnabled }));
  }

  function toggleAppTheme() {
    toggleTheme();
    setIsDarkModeEnabled(isDarkMode());
  }

  function showConfetti() {
    (containerRef.current as EmitterContainer)?.addEmitter(confettiEmitter);
  }

  useEffect(() => {
    if (finishedDailyGoal) {
      showConfetti();
      dispatch(resetDailyGoal());
    }
  }, [finishedDailyGoal]);

  return (
    <>
      <Particles
        id="tsparticles"
        init={particlesInit}
        container={containerRef}
        className="left-0, pointer-events-none absolute top-0 z-50 h-full w-full"
        options={confettiConfig}
      />
      <div className="relative grid h-screen justify-center transition-colors dark:bg-neutral-900">
        <Timer
          className="absolute left-1/2 top-1/2"
          style={{
            transform: "translate(-50%, -50%)",
          }}
        />

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
              <button onClick={stats.open} disabled={isStarted}>
                <FiBarChart2 />
              </button>
              <button onClick={settings.open} disabled={isStarted}>
                <FiSettings />
              </button>
            </IconContext.Provider>
          </IconContext.Provider>
        </div>

        <Drawer isOpen={settings.isOpen} onClose={settings.close} placement="right">
          <Settings
            className="h-screen overflow-y-auto bg-white p-5 shadow shadow-gray-700 transition-colors dark:bg-neutral-900 dark:text-neutral-200 sm:w-[440px]"
            onClose={settings.close}
          />
        </Drawer>
        <Drawer isOpen={stats.isOpen} onClose={stats.close} placement="right">
          <Stats onClose={stats.close} />
        </Drawer>
      </div>
    </>
  );
}
