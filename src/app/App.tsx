import { Timer } from "@/features/Timer";
import { Settings } from "@/features/Settings/Settings";
import { Portal, usePortal } from "@/features/Portal";
import { FiBell, FiBellOff, FiMoon, FiSettings, FiSun } from "react-icons/all";
import { IconContext } from "react-icons";
import { useAppDispatch, useAppSelector } from "../store";
import { PomodoroStatus } from "@/features/Timer/timerSlice";
import { updateSettings } from "@/features/Settings/settingsSlice";
import { isDarkMode, toggleTheme } from "@/common/darkMode";
import { useCallback, useEffect, useRef, useState } from "react";
import { loadFull } from "tsparticles";
import type { Container, Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
import { confettiConfig } from "@/app/confettiConfig";
import { resetDailyGoal } from "@/app/appSlice";

export function App() {
  const containerRef = useRef<Container | null>(null);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    container?.pause();
  }, []);

  const { isOpen, openPortal, closePortal } = usePortal(false);
  const timerStatus = useAppSelector((state) => state.timer.status);
  const appSettings = useAppSelector((state) => state.settings);
  const isSoundEnabled = useAppSelector((state) => state.settings.canPlaySound);
  const dispatch = useAppDispatch();
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(isDarkMode());
  const finishedDailyGoal = useAppSelector((state) => state.app.finishedDailyGoal);

  function toggleSound() {
    dispatch(updateSettings({ ...appSettings, canPlaySound: !isSoundEnabled }));
  }

  function toggleAppTheme() {
    toggleTheme();
    setIsDarkModeEnabled(isDarkMode());
  }

  function showConfetti() {
    containerRef.current?.play();
    setTimeout(() => containerRef.current?.stop(), 8000);
  }

  useEffect(() => {
    console.log(containerRef.current?.destroyed);

    if (finishedDailyGoal) {
      console.log(containerRef.current);
      containerRef.current?.play();
      dispatch(resetDailyGoal());
    }
  }, [finishedDailyGoal]);

  return (
    <>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        container={containerRef}
        className="left-0, pointer-events-none absolute top-0 z-50 h-full w-full"
        options={confettiConfig}
      />
      <div className="relative grid h-screen justify-center transition-colors dark:bg-dark">
        <Timer
          className="absolute left-1/2 top-1/2"
          style={{
            transform: "translate(-50%, -50%)",
          }}
        />

        <>
          <div className="absolute right-0 top-0 m-6 flex gap-4">
            <button onClick={showConfetti} className="rounded bg-sky-500 px-4 text-white">
              Show confetti
            </button>

            <IconContext.Provider value={{ size: "2em", className: "dark:text-neutral-200" }}>
              <button onClick={toggleAppTheme}>{isDarkModeEnabled ? <FiSun /> : <FiMoon />}</button>
              <button onClick={toggleSound}>{isSoundEnabled ? <FiBell /> : <FiBellOff />}</button>
              {timerStatus === PomodoroStatus.UNSTARTED && (
                <button onClick={openPortal}>
                  <FiSettings />
                </button>
              )}
            </IconContext.Provider>
          </div>
          <Portal isOpen={isOpen}>
            <Settings
              className="absolute right-0 top-0 h-full w-screen bg-white p-5 shadow shadow-gray-700 dark:bg-dark dark:text-neutral-200 sm:w-[440px]"
              onClose={closePortal}
            />
          </Portal>
        </>
      </div>
    </>
  );
}
