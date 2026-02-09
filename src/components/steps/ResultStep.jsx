import { useState, useRef, useEffect } from "react";
import { ChevronLeft, RotateCcw, Database, Save } from "lucide-react";
import { saveTrip } from "../../utils/tripStorage";
import { TRAVEL_STYLES } from "../../data/constants";
import ItineraryDay from "../result/ItineraryDay";
import TransportInfo from "../result/TransportInfo";
import BudgetSummary from "../result/BudgetSummary";
import ShareSection from "../result/ShareSection";
import SpotSwapModal from "../result/SpotSwapModal";
import KakaoMap from "../map/KakaoMap";

export default function ResultStep({ wizard, route, isDark }) {
  const { selectedZone, selectedVibes, travelMode, duration, prevStep, resetAll } = wizard;
  const [mapExpanded, setMapExpanded] = useState(false);

  // 스팟 교체 상태
  const [modifiedRoute, setModifiedRoute] = useState(null);
  const [swapModal, setSwapModal] = useState(null);
  const [saved, setSaved] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => setScrolled(el.scrollTop > 40);
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSave = () => {
    const result = saveTrip({
      zone: selectedZone,
      vibes: selectedVibes,
      duration,
      travelMode,
      route: displayRoute,
    });
    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const displayRoute = modifiedRoute || route;

  if (!displayRoute) return null;

  const handleSwapRequest = (dayIndex, scheduleIndex, spot) => {
    setSwapModal({ dayIndex, scheduleIndex, spot });
  };

  const handleSwap = (newSpot) => {
    const newRoute = JSON.parse(JSON.stringify(displayRoute));
    const { dayIndex, scheduleIndex, spot: oldSpot } = swapModal;

    newRoute.itinerary[dayIndex].schedule[scheduleIndex] = {
      ...newSpot,
      time: newRoute.itinerary[dayIndex].schedule[scheduleIndex].time,
      type: "spot",
    };

    const oldAlts = (newRoute.alternatives[oldSpot.name] || []).filter(
      (a) => a.name !== newSpot.name
    );
    oldAlts.push({
      ...oldSpot,
      travelTimeFromCurrent: newSpot.travelTimeFromCurrent || 10,
    });
    delete newRoute.alternatives[oldSpot.name];
    newRoute.alternatives[newSpot.name] = oldAlts;

    setModifiedRoute(newRoute);
    setSwapModal(null);
  };

  const totalSpots = displayRoute.itinerary.reduce(
    (sum, day) => sum + day.schedule.filter((s) => s.type === "spot").length,
    0
  );

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* 스티키 헤더 */}
      <div
        className={`sticky top-0 z-40 text-white relative overflow-hidden transition-all duration-300 ${
          scrolled ? "shadow-xl" : ""
        }`}
        style={{
          background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0d2818 100%)",
          backdropFilter: scrolled ? "blur(12px)" : undefined,
        }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#00A86B]/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#0066CC]/10 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div
          className={`relative z-10 px-5 sm:px-6 transition-all duration-300 ${
            scrolled ? "py-3" : "py-6 sm:py-8"
          }`}
        >
          {/* 컴팩트 모드: 한 줄 요약 */}
          {scrolled ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs opacity-50">
                <Database className="w-3.5 h-3.5" />
              </div>
              <h1 className="text-base font-extrabold flex-1 truncate">
                {selectedZone?.emoji} {selectedZone?.name}
              </h1>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-white/10 rounded-full text-[10px]">
                  📅 {duration}
                </span>
                <span className="px-2 py-0.5 bg-white/10 rounded-full text-[10px]">
                  📍 {totalSpots}곳
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm opacity-60 mb-2 sm:mb-3">
                <Database className="w-4 h-4" />
                <span>DB-DEEP 강원</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2">나의 강원 데이터</h1>

              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                <span className="px-2.5 sm:px-3 py-1 bg-[#00A86B]/20 border border-[#00A86B]/30 rounded-full text-xs sm:text-sm font-medium">
                  {selectedZone?.emoji} {selectedZone?.name}
                </span>
                {selectedVibes.map((v) => {
                  const style = TRAVEL_STYLES.find((s) => s.id === v);
                  return (
                    <span key={v} className="px-2 py-1 bg-white/10 rounded-full text-[10px] sm:text-xs">
                      {style?.emoji} {style?.label}
                    </span>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                <span className="px-2.5 sm:px-3 py-1 bg-white/10 rounded-full text-[10px] sm:text-xs">
                  {travelMode === "자차" ? "🚗" : "🚌"} {travelMode}
                </span>
                <span className="px-2.5 sm:px-3 py-1 bg-white/10 rounded-full text-[10px] sm:text-xs">📅 {duration}</span>
                <span className="px-2.5 sm:px-3 py-1 bg-white/10 rounded-full text-[10px] sm:text-xs">
                  📍 스팟 {totalSpots}곳
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 스크롤 가능 본문 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {/* 카카오맵 */}
        <div
          className="mx-3 sm:mx-4 mt-3 sm:mt-4 rounded-2xl overflow-hidden shadow-sm"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
        >
          <KakaoMap
            itinerary={displayRoute.itinerary}
            expanded={mapExpanded}
            onToggleExpand={() => setMapExpanded((v) => !v)}
          />
        </div>

        {/* 일정 */}
        <div className="px-3 sm:px-4 pb-36 sm:pb-40">
          {displayRoute.itinerary.map((day, dayIdx) => (
            <ItineraryDay
              key={dayIdx}
              day={day}
              dayIndex={dayIdx}
              alternatives={displayRoute.alternatives}
              onSwapRequest={handleSwapRequest}
              travelMode={travelMode}
              isDark={isDark}
            />
          ))}

          <TransportInfo transportInfo={displayRoute.transportInfo} travelMode={travelMode} isDark={isDark} />
          <BudgetSummary itinerary={displayRoute.itinerary} isDark={isDark} />

          <ShareSection
            route={displayRoute}
            zone={selectedZone}
            vibes={selectedVibes}
            duration={duration}
            travelMode={travelMode}
          />
        </div>
      </div>

      {/* 하단 버튼 */}
      <div
        className="fixed bottom-0 left-0 right-0 backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-4 flex gap-2 sm:gap-3 z-50"
        style={{
          background: "color-mix(in srgb, var(--bg-secondary) 95%, transparent)",
          borderTop: "1px solid var(--border-color)",
        }}
      >
        <button
          onClick={resetAll}
          className="flex items-center justify-center gap-1.5 min-h-[48px] px-4 rounded-2xl font-bold text-sm transition-colors active:scale-95 transform"
          style={{ background: "var(--bg-input)", color: "var(--text-secondary)" }}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={handleSave}
          className={`flex items-center justify-center gap-1.5 min-h-[48px] px-4 sm:px-5 rounded-2xl font-bold text-sm transition-all active:scale-95 transform ${
            saved
              ? "bg-[#00A86B] text-white"
              : "border-2 border-[#0066CC] text-[#0066CC]"
          }`}
          style={!saved ? { background: isDark ? "rgba(0,102,204,0.1)" : "#EBF5FF" } : undefined}
        >
          <Save className="w-4 h-4" />
          {saved ? "저장됨!" : "저장"}
        </button>
        <button
          onClick={prevStep}
          className="flex-1 flex items-center justify-center gap-2 min-h-[48px] border-2 border-[#0066CC] text-[#0066CC] rounded-2xl font-bold text-sm sm:text-base transition-colors active:scale-95 transform"
          style={{ background: isDark ? "rgba(0,102,204,0.1)" : "#EBF5FF" }}
        >
          <ChevronLeft className="w-5 h-5" /> 설정 변경
        </button>
      </div>

      {swapModal && (
        <SpotSwapModal
          currentSpot={swapModal.spot}
          alternatives={displayRoute.alternatives[swapModal.spot.name] || []}
          onSwap={handleSwap}
          onClose={() => setSwapModal(null)}
          isDark={isDark}
        />
      )}
    </div>
  );
}
