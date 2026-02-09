import { useState } from "react";
import { MapPin, ChevronLeft, RotateCcw, Database } from "lucide-react";
import { TRAVEL_STYLES } from "../../data/constants";
import ItineraryDay from "../result/ItineraryDay";
import TransportInfo from "../result/TransportInfo";
import ShareSection from "../result/ShareSection";
import SpotSwapModal from "../result/SpotSwapModal";
import KakaoMap from "../map/KakaoMap";

export default function ResultStep({ wizard, route }) {
  const { selectedZone, selectedVibes, travelMode, duration, prevStep, resetAll } = wizard;
  const [mapExpanded, setMapExpanded] = useState(false);

  // 스팟 교체 상태
  const [modifiedRoute, setModifiedRoute] = useState(null);
  const [swapModal, setSwapModal] = useState(null); // { dayIndex, scheduleIndex, spot }

  const displayRoute = modifiedRoute || route;

  if (!displayRoute) return null;

  // 스팟 교체 요청
  const handleSwapRequest = (dayIndex, scheduleIndex, spot) => {
    setSwapModal({ dayIndex, scheduleIndex, spot });
  };

  // 스팟 교체 실행
  const handleSwap = (newSpot) => {
    const newRoute = JSON.parse(JSON.stringify(displayRoute));
    const { dayIndex, scheduleIndex, spot: oldSpot } = swapModal;

    // 스케줄에서 교체
    newRoute.itinerary[dayIndex].schedule[scheduleIndex] = {
      ...newSpot,
      time: newRoute.itinerary[dayIndex].schedule[scheduleIndex].time,
      type: "spot",
    };

    // 대안 목록 업데이트: 새 스팟 제거, 기존 스팟 추가
    const oldAlts = (newRoute.alternatives[oldSpot.name] || []).filter(
      (a) => a.name !== newSpot.name
    );
    // 기존 스팟을 새 스팟의 대안으로
    oldAlts.push({
      ...oldSpot,
      travelTimeFromCurrent: newSpot.travelTimeFromCurrent || 10,
    });
    delete newRoute.alternatives[oldSpot.name];
    newRoute.alternatives[newSpot.name] = oldAlts;

    setModifiedRoute(newRoute);
    setSwapModal(null);
  };

  // 총 스팟 수 계산
  const totalSpots = displayRoute.itinerary.reduce(
    (sum, day) => sum + day.schedule.filter((s) => s.type === "spot").length,
    0
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FA]">
      {/* DB-DEEP 헤더 */}
      <div className="bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#0d2818] text-white px-6 py-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#00A86B]/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#0066CC]/10 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-sm opacity-60 mb-3">
            <Database className="w-4 h-4" />
            <span>DB-DEEP 강원</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-2">나의 강원 데이터</h1>

          {/* Zone + Vibe 뱃지 */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-3 py-1 bg-[#00A86B]/20 border border-[#00A86B]/30 rounded-full text-sm font-medium">
              {selectedZone?.emoji} {selectedZone?.name}
            </span>
            {selectedVibes.map((v) => {
              const style = TRAVEL_STYLES.find((s) => s.id === v);
              return (
                <span key={v} className="px-2 py-1 bg-white/10 rounded-full text-xs">
                  {style?.emoji} {style?.label}
                </span>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs">
              {travelMode === "자차" ? "🚗" : "🚌"} {travelMode}
            </span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs">📅 {duration}</span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs">
              📍 스팟 {totalSpots}곳
            </span>
          </div>
        </div>
      </div>

      {/* 카카오맵 */}
      <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <KakaoMap
          itinerary={displayRoute.itinerary}
          expanded={mapExpanded}
          onToggleExpand={() => setMapExpanded((v) => !v)}
        />
      </div>

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto px-4 pb-40">
        {/* 일정표 */}
        {displayRoute.itinerary.map((day, dayIdx) => (
          <ItineraryDay
            key={dayIdx}
            day={day}
            dayIndex={dayIdx}
            alternatives={displayRoute.alternatives}
            onSwapRequest={handleSwapRequest}
          />
        ))}

        {/* 교통 정보 */}
        <TransportInfo transportInfo={displayRoute.transportInfo} travelMode={travelMode} />

        {/* 공유 (데이터 영수증) */}
        <ShareSection
          route={displayRoute}
          zone={selectedZone}
          vibes={selectedVibes}
          duration={duration}
          travelMode={travelMode}
        />
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-6 py-4 flex gap-3 z-50">
        <button
          onClick={resetAll}
          className="flex items-center justify-center gap-1.5 py-4 px-5 bg-gray-100 text-gray-700 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-colors active:scale-95 transform"
        >
          <RotateCcw className="w-4 h-4" /> 처음부터
        </button>
        <button
          onClick={prevStep}
          className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-[#0066CC] text-[#0066CC] rounded-2xl font-bold text-base hover:bg-blue-50 transition-colors active:scale-95 transform"
        >
          <ChevronLeft className="w-5 h-5" /> 설정 변경
        </button>
      </div>

      {/* 스팟 교체 모달 */}
      {swapModal && (
        <SpotSwapModal
          currentSpot={swapModal.spot}
          alternatives={displayRoute.alternatives[swapModal.spot.name] || []}
          onSwap={handleSwap}
          onClose={() => setSwapModal(null)}
        />
      )}
    </div>
  );
}
