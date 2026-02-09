import { useState } from "react";
import { MapPin, ChevronLeft, RotateCcw } from "lucide-react";
import ItineraryDay from "../result/ItineraryDay";
import TransportInfo from "../result/TransportInfo";
import ShareSection from "../result/ShareSection";
import KakaoMap from "../map/KakaoMap";

export default function ResultStep({ wizard, route }) {
  const { selectedRegions, selectedSpots, selectedFoods, travelMode, duration, prevStep, resetAll } = wizard;
  const [mapExpanded, setMapExpanded] = useState(false);

  if (!route) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FA]">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-[#0066CC] to-[#00A86B] text-white px-6 py-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-sm opacity-80 mb-2">
            <MapPin className="w-4 h-4" />
            <span>{selectedRegions.join(" → ")}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-2">나만의 강원도 여행 루트</h1>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
              {travelMode === "자차" ? "🚗" : "🚌"} {travelMode}
            </span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">📅 {duration}</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
              📍 관광지 {selectedSpots.length}곳
            </span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
              🍽️ 음식 {selectedFoods.length}개
            </span>
          </div>
        </div>
      </div>

      {/* 카카오맵 */}
      <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <KakaoMap
          itinerary={route.itinerary}
          expanded={mapExpanded}
          onToggleExpand={() => setMapExpanded((v) => !v)}
        />
      </div>

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto px-4 pb-40">
        {/* 일정표 */}
        {route.itinerary.map((day, dayIdx) => (
          <ItineraryDay key={dayIdx} day={day} />
        ))}

        {/* 교통 정보 */}
        <TransportInfo transportInfo={route.transportInfo} travelMode={travelMode} />

        {/* 공유 */}
        <ShareSection
          route={route}
          selectedRegions={selectedRegions}
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
    </div>
  );
}
