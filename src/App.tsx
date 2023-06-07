import { Timer } from "@/features/Timer";
import { Settings } from "@/features/Settings/Settings";
import { Portal, usePortal } from "@/features/Portal";
import { FiBell, FiBellOff, FiSettings } from "react-icons/all";
import { IconContext } from "react-icons";
import { useAppDispatch, useAppSelector } from "@/store";
import { SessionStatus } from "@/features/Timer/timerSlice";
import { updateSettings } from "@/features/Settings/settingsSlice";

function App() {
  const { isOpen, openPortal, closePortal } = usePortal(false);
  const timerStatus = useAppSelector((state) => state.timer.status);
  const appSettings = useAppSelector((state) => state.settings);
  const isSoundEnabled = useAppSelector((state) => state.settings.canPlaySound);
  const dispatch = useAppDispatch();

  function toggleSound() {
    dispatch(updateSettings({ ...appSettings, canPlaySound: !isSoundEnabled }));
  }

  return (
    <div className="relative grid h-screen justify-center">
      <Timer
        className="absolute left-1/2 top-1/2"
        style={{
          transform: "translate(-50%, -50%)",
        }}
      />

      <>
        <div className="absolute right-0 top-0 m-6 flex gap-4">
          <IconContext.Provider value={{ size: "2em" }}>
            <span onClick={toggleSound}>{isSoundEnabled ? <FiBell /> : <FiBellOff />}</span>
            {timerStatus === SessionStatus.UNSTARTED && <FiSettings onClick={openPortal} />}
          </IconContext.Provider>
        </div>
        <Portal isOpen={isOpen}>
          <Settings
            className="absolute right-0 top-0 h-full w-screen bg-white p-5 shadow shadow-gray-700 sm:w-[440px]"
            onClose={closePortal}
          />
        </Portal>
      </>
    </div>
  );
}

export default App;
