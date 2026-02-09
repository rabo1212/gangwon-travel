import { useMemo, lazy, Suspense } from "react";
import { useWizard } from "./hooks/useWizard";
import { optimizeRoute } from "./utils/routeOptimizer";
import WelcomeStep from "./components/steps/WelcomeStep";

const RegionStep = lazy(() => import("./components/steps/RegionStep"));
const SpotPickerStep = lazy(() => import("./components/steps/SpotPickerStep"));
const FoodPickerStep = lazy(() => import("./components/steps/FoodPickerStep"));
const TripSettingsStep = lazy(() => import("./components/steps/TripSettingsStep"));
const ResultStep = lazy(() => import("./components/steps/ResultStep"));

function StepLoader() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#0066CC] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      </div>
    </div>
  );
}

export default function GangwonTravelApp() {
  const wizard = useWizard();

  const route = useMemo(() => {
    if (wizard.step < 5) return null;
    return optimizeRoute({
      selectedSpots: wizard.selectedSpots,
      selectedRestaurants: wizard.selectedRestaurants,
      duration: wizard.duration,
      travelMode: wizard.travelMode,
      selectedRegions: wizard.selectedRegions,
      selectedAccomTypes: wizard.selectedAccomTypes,
      selectedPriceRange: wizard.selectedPriceRange,
    });
  }, [
    wizard.step,
    wizard.selectedSpots,
    wizard.selectedRestaurants,
    wizard.duration,
    wizard.travelMode,
    wizard.selectedRegions,
    wizard.selectedAccomTypes,
    wizard.selectedPriceRange,
  ]);

  const renderStep = () => {
    switch (wizard.step) {
      case 0: return <WelcomeStep onNext={wizard.nextStep} />;
      case 1: return <RegionStep wizard={wizard} />;
      case 2: return <SpotPickerStep wizard={wizard} />;
      case 3: return <FoodPickerStep wizard={wizard} />;
      case 4: return <TripSettingsStep wizard={wizard} />;
      case 5: return <ResultStep wizard={wizard} route={route} />;
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
