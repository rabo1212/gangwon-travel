import { useMemo, lazy, Suspense } from "react";
import { useWizard } from "./hooks/useWizard";
import { generateRoute } from "./utils/routeOptimizer";
import WelcomeStep from "./components/steps/WelcomeStep";

const ZoneVibeStep = lazy(() => import("./components/steps/ZoneVibeStep"));
const TripSettingsStep = lazy(() => import("./components/steps/TripSettingsStep"));
const ResultStep = lazy(() => import("./components/steps/ResultStep"));

function StepLoader() {
  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#00A86B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-white/40 text-sm">불러오는 중...</p>
      </div>
    </div>
  );
}

export default function GangwonTravelApp() {
  const wizard = useWizard();

  const route = useMemo(() => {
    if (wizard.step < 3) return null;
    return generateRoute({
      selectedZone: wizard.selectedZone,
      selectedVibes: wizard.selectedVibes,
      duration: wizard.duration,
      travelMode: wizard.travelMode,
    });
  }, [wizard.step, wizard.selectedZone, wizard.selectedVibes, wizard.duration, wizard.travelMode]);

  const renderStep = () => {
    switch (wizard.step) {
      case 0: return <WelcomeStep onNext={wizard.nextStep} />;
      case 1: return <ZoneVibeStep wizard={wizard} />;
      case 2: return <TripSettingsStep wizard={wizard} />;
      case 3: return <ResultStep wizard={wizard} route={route} />;
      default: return <WelcomeStep onNext={wizard.nextStep} />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <div
        className={`transition-all duration-300 ease-in-out ${
          wizard.isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        <Suspense fallback={<StepLoader />}>
          {renderStep()}
        </Suspense>
      </div>
    </div>
  );
}
