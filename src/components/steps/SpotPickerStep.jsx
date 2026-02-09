import { useState, useMemo } from "react";
import { Check, MapPin, Clock, Camera } from "lucide-react";
import { ALL_SPOTS } from "../../data/spots";
import StepHeader from "../ui/StepHeader";
import ProgressBar from "../ui/ProgressBar";
import BottomNav from "../ui/BottomNav";

const CATEGORY_COLORS = {
  "휴양/힐링": "bg-green-100 text-green-700",
  "체험/액티비티": "bg-orange-100 text-orange-700",
  "맛집/미식": "bg-red-100 text-red-700",
  "문화/역사": "bg-blue-100 text-blue-700",
  "포토스팟/감성": "bg-pink-100 text-pink-700",
  "자연/트레킹": "bg-emerald-100 text-emerald-700",
};

export default function SpotPickerStep({ wizard }) {
  const { selectedRegions, selectedSpots, toggleSpot, prevStep, nextStep, canProceed, TOTAL_STEPS } = wizard;
  const [activeTab, setActiveTab] = useState(selectedRegions[0] || "");

  // 현재 탭의 관광지를 카테고리별로 그룹화
  const spotsByCategory = useMemo(() => {
    const spots = ALL_SPOTS[activeTab] || [];
    const grouped = {};
    spots.forEach((spot) => {
      const cat = spot.category || "기타";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push({ ...spot, region: activeTab });
    });
    return grouped;
  }, [activeTab]);

  const isSpotSelected = (spot) =>
    selectedSpots.some((s) => s.name === spot.name && s.region === (spot.region || activeTab));

  const selectedCount = selectedSpots.length;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <StepHeader
        title="관광지 선택"
        subtitle={`가고 싶은 관광지를 골라주세요 (${selectedCount}곳 선택됨)`}
        onBack={prevStep}
      />
      <ProgressBar currentStep={2} totalSteps={TOTAL_STEPS} />

      {/* 지역 탭 */}
      {selectedRegions.length > 1 && (
        <div className="flex gap-2 px-4 py-2 overflow-x-auto">
          {selectedRegions.map((region) => (
            <button
              key={region}
              onClick={() => setActiveTab(region)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === region
                  ? "bg-[#0066CC] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {region}
              {selectedSpots.filter((s) => s.region === region).length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-white/30 rounded-full text-xs">
                  {selectedSpots.filter((s) => s.region === region).length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* 선택된 장소 요약 칩 */}
      {selectedSpots.length > 0 && (
        <div className="flex flex-wrap gap-2 mx-4 mt-2 p-3 bg-blue-50 rounded-xl">
          {selectedSpots.map((s) => (
            <span
              key={`${s.region}-${s.name}`}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#0066CC] text-white rounded-full text-xs font-medium"
            >
              {s.emoji} {s.name}
              <button
                onClick={() => toggleSpot(s)}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 카테고리별 관광지 목록 */}
      <div className="flex-1 overflow-y-auto px-4 pb-32 mt-3">
        <div className="max-w-lg mx-auto space-y-6">
          {Object.entries(spotsByCategory).map(([category, spots]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${CATEGORY_COLORS[category] || "bg-gray-100 text-gray-700"}`}>
                  {category}
                </span>
                <span className="text-xs text-gray-400">{spots.length}곳</span>
              </div>

              <div className="space-y-2">
                {spots.map((spot) => {
                  const selected = isSpotSelected(spot);
                  return (
                    <button
                      key={spot.name}
                      onClick={() => toggleSpot({ ...spot, region: activeTab })}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 active:scale-[0.98] ${
                        selected
                          ? "border-[#0066CC] bg-blue-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-blue-200 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl mt-0.5">{spot.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-[#1A1A2E] truncate">{spot.name}</h3>
                            {spot.photoSpot && <Camera className="w-3.5 h-3.5 text-pink-500 shrink-0" />}
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{spot.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            {spot.duration && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {spot.duration}
                              </span>
                            )}
                            {spot.address && (
                              <span className="flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3 shrink-0" />
                                <span className="truncate">{spot.address.split(" ").slice(-2).join(" ")}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        {selected && (
                          <div className="w-7 h-7 bg-[#0066CC] rounded-full flex items-center justify-center shrink-0 mt-1">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav
        onNext={nextStep}
        canNext={canProceed}
        nextLabel={selectedCount >= 2 ? `${selectedCount}곳 선택 완료 - 다음` : "최소 2곳 이상 선택해주세요"}
      />
    </div>
  );
}
