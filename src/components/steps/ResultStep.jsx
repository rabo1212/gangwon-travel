import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { ChevronLeft, RotateCcw, Database, Save, Sparkles } from "lucide-react";
import { saveTrip } from "../../utils/tripStorage";
import { getFavorites, toggleFavorite } from "../../utils/favoriteStorage";
import { TRAVEL_STYLES } from "../../data/constants";
import DayTabs from "../result/DayTabs";
import ItineraryDay from "../result/ItineraryDay";
import TransportInfo from "../result/TransportInfo";
import BudgetSummary from "../result/BudgetSummary";
import ShareSection from "../result/ShareSection";
import SpotSwapModal from "../result/SpotSwapModal";
import SpotDetailModal from "../result/SpotDetailModal";
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

  // Phase 1: Day 탭
  const [activeDay, setActiveDay] = useState(null);

  // Phase 5: 찜/하트
  const [favorites, setFavorites] = useState(() => new Set(getFavorites().map((f) => f.name)));

  // Phase 6: 장소 상세 모달
  const [detailSpot, setDetailSpot] = useState(null);

  // Phase 9: 지도↔타임라인 연동
  const kakaoMapRef = useRef(null);
  const cardRefsMap = useRef(new Map());

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

  // Phase 5: 찜 토글
  const handleToggleFavorite = useCallback((spot) => {
    const isNowFavorited = toggleFavorite(spot);
    setFavorites((prev) => {
      const next = new Set(prev);
      if (isNowFavorited) next.add(spot.name);
      else next.delete(spot.name);
      return next;
    });
  }, []);

  // Phase 9: 마커 클릭 → 카드 스크롤
  const handleMarkerClick = useCallback((spotName) => {
    const cardEl = cardRefsMap.current.get(spotName);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: "smooth", block: "center" });
      cardEl.classList.add("ring-2", "ring-[#0066CC]");
      setTimeout(() => cardEl.classList.remove("ring-2", "ring-[#0066CC]"), 2000);
    }
  }, []);

  // Phase 9: 카드 클릭 → 지도 이동
  const handleCardClickOnMap = useCallback((spot) => {
    if (spot.latitude && spot.longitude) {
      kakaoMapRef.current?.focusMarker(spot.name, spot.latitude, spot.longitude);
    }
  }, []);

  const totalSpots = displayRoute.itinerary.reduce(
    (sum, day) => sum + day.schedule.filter((s) => s.type === "spot").length,
    0
  );

  // Phase 1: Day 필터
  const filteredItinerary = useMemo(() => {
    if (activeDay === null) return displayRoute.itinerary;
    return [displayRoute.itinerary[activeDay]].filter(Boolean);
  }, [displayRoute, activeDay]);

  // Phase 2: AI 요약 문구
  const aiSummary = useMemo(() => {
    const vibeLabels = selectedVibes
      .map((v) => {
        const s = TRAVEL_STYLES.find((t) => t.id === v);
        return s?.label;
      })
      .filter(Boolean)
      .join(" · ");
    const durationText =
      duration === "당일치기" ? "당일" : duration === "1박2일" ? "1박 2일" : "2박 3일";
    return `${selectedZone?.emoji} ${selectedZone?.name}에서 ${vibeLabels}을 즐기는 ${durationText} 여행 추천일정입니다`;
  }, [selectedZone, selectedVibes, duration]);

  // spotStartIndex 계산
  const getSpotStartIndex = (dayIdx) => {
    let count = 1;
    for (let i = 0; i < dayIdx; i++) {
      count += displayRoute.itinerary[i].schedule.filter((s) => s.type === "spot").length;
    }
    return count;
  };

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
        {/* Phase 2: AI 요약 문구 */}
        <div
          className="mx-3 sm:mx-4 mt-3 px-4 py-3 rounded-xl flex items-start gap-2"
          style={{
            background: isDark ? "rgba(0,168,107,0.08)" : "#F0FDF4",
            border: `1px solid ${isDark ? "rgba(0,168,107,0.2)" : "#BBF7D0"}`,
          }}
        >
          <Sparkles className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#00A86B" }} />
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {aiSummary}
          </p>
        </div>

        {/* 카카오맵 */}
        <div
          className="mx-3 sm:mx-4 mt-3 sm:mt-4 rounded-2xl overflow-hidden shadow-sm"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
        >
          <KakaoMap
            ref={kakaoMapRef}
            itinerary={displayRoute.itinerary}
            activeDay={activeDay}
            expanded={mapExpanded}
            onToggleExpand={() => setMapExpanded((v) => !v)}
            onMarkerClick={handleMarkerClick}
          />
        </div>

        {/* Phase 1: Day 탭 */}
        <DayTabs
          days={displayRoute.itinerary}
          activeDay={activeDay}
          onSelectDay={setActiveDay}
        />

        {/* 일정 */}
        <div className="px-3 sm:px-4 pb-36 sm:pb-40">
          {filteredItinerary.map((day) => {
            const originalDayIdx = displayRoute.itinerary.indexOf(day);
            return (
              <ItineraryDay
                key={day.day}
                day={day}
                dayIndex={originalDayIdx}
                alternatives={displayRoute.alternatives}
                onSwapRequest={handleSwapRequest}
                travelMode={travelMode}
                isDark={isDark}
                spotStartIndex={getSpotStartIndex(originalDayIdx)}
                onToggleFavorite={handleToggleFavorite}
                favoriteSet={favorites}
                onDetailOpen={setDetailSpot}
                onCardClick={handleCardClickOnMap}
                cardRefsMap={cardRefsMap}
              />
            );
          })}

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

      {detailSpot && (
        <SpotDetailModal
          spot={detailSpot}
          isDark={isDark}
          onClose={() => setDetailSpot(null)}
          hasAlternatives={!!displayRoute.alternatives[detailSpot.name]?.length}
          onSwapRequest={() => {
            const dayIdx = displayRoute.itinerary.findIndex((d) =>
              d.schedule.some((s) => s.name === detailSpot.name)
            );
            if (dayIdx >= 0) {
              const schedIdx = displayRoute.itinerary[dayIdx].schedule.findIndex(
                (s) => s.name === detailSpot.name
              );
              if (schedIdx >= 0) {
                setDetailSpot(null);
                handleSwapRequest(dayIdx, schedIdx, detailSpot);
              }
            }
          }}
        />
      )}
    </div>
  );
}
