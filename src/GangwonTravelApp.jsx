import { useState, useMemo, useCallback, useEffect, lazy, Suspense } from "react";
import { useWizard } from "./hooks/useWizard";
import { useTheme } from "./hooks/useTheme";
import { generateRoute, setPreloadedSpots, setPreloadedAccommodations } from "./utils/routeOptimizer";
import * as dataProvider from "./services/dataProvider";
import WelcomeStep from "./components/steps/WelcomeStep";

const ZoneVibeStep = lazy(() => import("./components/steps/ZoneVibeStep"));
const TripSettingsStep = lazy(() => import("./components/steps/TripSettingsStep"));
const ResultStep = lazy(() => import("./components/steps/ResultStep"));

function StepLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#00A86B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>불러오는 중...</p>
      </div>
    </div>
  );
}

export default function GangwonTravelApp() {
  const wizard = useWizard();
  const { isDark, toggleTheme } = useTheme();
  const [loadedRoute, setLoadedRoute] = useState(null);

  // Zone 선택 시 API 데이터 프리로드 (routeOptimizer에서 사용)
  useEffect(() => {
    if (!wizard.selectedZone) return;
    wizard.selectedZone.regions.forEach((region) => {
      dataProvider.getSpots(region).then((spots) => setPreloadedSpots(region, spots));
      dataProvider.getAccommodations(region).then((accom) => setPreloadedAccommodations(region, accom));
    });
  }, [wizard.selectedZone]);

  const route = useMemo(() => {
    if (loadedRoute) return loadedRoute;
    if (wizard.step < 3) return null;
    return generateRoute({
      selectedZone: wizard.selectedZone,
      selectedVibes: wizard.selectedVibes,
      duration: wizard.duration,
      travelMode: wizard.travelMode,
    });
  }, [wizard.step, wizard.selectedZone, wizard.selectedVibes, wizard.duration, wizard.travelMode, loadedRoute]);

  const handleLoadTrip = useCallback((savedTrip) => {
    wizard.loadState(savedTrip.zone, savedTrip.vibes, savedTrip.travelMode, savedTrip.duration);
    setLoadedRoute(savedTrip.route);
    wizard.goToStep(3);
  }, [wizard]);

  const handleNextFromWelcome = useCallback(() => {
    setLoadedRoute(null);
    wizard.nextStep();
  }, [wizard]);

  const renderStep = () => {
    switch (wizard.step) {
      case 0: return <WelcomeStep onNext={handleNextFromWelcome} onLoadTrip={handleLoadTrip} />;
      case 1: return <ZoneVibeStep wizard={wizard} isDark={isDark} />;
      case 2: return <TripSettingsStep wizard={wizard} isDark={isDark} />;
      case 3: return <ResultStep wizard={wizard} route={route} isDark={isDark} />;
      default: return <WelcomeStep onNext={handleNextFromWelcome} onLoadTrip={handleLoadTrip} />;
    }
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      {/* 테마 토글 버튼 */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-[100] w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-lg transition-all duration-300 active:scale-90"
        style={{
          background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
          color: isDark ? "#fff" : "#1A1A2E",
          backdropFilter: "blur(8px)",
        }}
        aria-label="테마 전환"
      >
        {isDark ? "☀️" : "🌙"}
      </button>

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
