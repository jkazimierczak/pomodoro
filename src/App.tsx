import { Timer } from "@/features/Timer";

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
    </div>
  );
}

export default App;
