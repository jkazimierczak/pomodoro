import { Timer } from "@/features/Timer";
import { Settings } from "@/features/Settings/Settings";

function App() {
  return (
    <div className="relative grid h-screen justify-center">
      <Timer
        initialDurations={{ session: 25, break: 5 }}
        className="absolute left-1/2 top-1/2"
        style={{
          transform: "translate(-50%, -50%)",
        }}
      />
      <Settings className="absolute right-0 top-0 h-full w-[440px] bg-white p-5 shadow-lg" />
    </div>
  );
}

export default App;
