import { useState, useMemo } from "react";
import { Check, MapPin, Clock } from "lucide-react";
import { ALL_RESTAURANTS } from "../../data/restaurants";
import { GENRE_EMOJIS, STYLE_TAG_COLORS } from "../../data/constants";
import StepHeader from "../ui/StepHeader";
import ProgressBar from "../ui/ProgressBar";
import BottomNav from "../ui/BottomNav";

export default function FoodPickerStep({ wizard }) {
  const { selectedRegions, selectedRestaurants, toggleRestaurant, prevStep, nextStep, canProceed, TOTAL_STEPS } = wizard;
  const [activeTab, setActiveTab] = useState(selectedRegions[0] || "");

  // 현재 탭의 맛집을 genre별로 그룹화
  const restaurantsByGenre = useMemo(() => {
    const restaurants = ALL_RESTAURANTS[activeTab] || [];
    const grouped = {};
    restaurants.forEach((rest) => {
      const genre = rest.genre || "기타";
      if (!grouped[genre]) grouped[genre] = [];
      grouped[genre].push({ ...rest, region: activeTab });
    });
    return grouped;
  }, [activeTab]);

  const isRestSelected = (rest) =>
    selectedRestaurants.some((r) => r.name === rest.name && r.region === (rest.region || activeTab));

  const selectedCount = selectedRestaurants.length;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <StepHeader
        title="맛집/카페 선택"
        subtitle={`맛집과 카페를 골라주세요 (${selectedCount}곳 선택됨)`}
        onBack={prevStep}
      />
      <ProgressBar currentStep={3} totalSteps={TOTAL_STEPS} />

      {/* 지역 탭 */}
      {selectedRegions.length > 1 && (
        <div className="flex gap-2 px-4 py-2 overflow-x-auto">
          {selectedRegions.map((region) => (
            <button
              key={region}
              onClick={() => setActiveTab(region)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === region
                  ? "bg-[#FF6B35] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {region}
              {selectedRestaurants.filter((r) => r.region === region).length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-white/30 rounded-full text-xs">
                  {selectedRestaurants.filter((r) => r.region === region).length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* 선택된 맛집 요약 칩 */}
      {selectedRestaurants.length > 0 && (
        <div className="flex flex-wrap gap-2 mx-4 mt-2 p-3 bg-orange-50 rounded-xl">
          {selectedRestaurants.map((r) => (
            <span
              key={`${r.region}-${r.name}`}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#FF6B35] text-white rounded-full text-xs font-medium"
            >
              {r.emoji} {r.name}
              <button
                onClick={() => toggleRestaurant(r)}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 장르별 맛집 목록 */}
      <div className="flex-1 overflow-y-auto px-4 pb-32 mt-3">
        <div className="max-w-lg mx-auto space-y-6">
          {Object.entries(restaurantsByGenre).map(([genre, restaurants]) => (
            <div key={genre}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{GENRE_EMOJIS[genre] || "🍽️"}</span>
                <span className="text-base font-bold text-[#1A1A2E]">{genre}</span>
                <span className="text-xs text-gray-400">{restaurants.length}곳</span>
              </div>

              <div className="space-y-2">
                {restaurants.map((rest) => {
                  const selected = isRestSelected(rest);
                  return (
                    <button
                      key={rest.name}
                      onClick={() => toggleRestaurant({ ...rest, region: activeTab })}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 active:scale-[0.98] ${
                        selected
                          ? "border-[#FF6B35] bg-orange-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-orange-200 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl mt-0.5">{rest.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-[#1A1A2E] truncate">{rest.name}</h3>
                          <p className="text-sm text-[#FF6B35] font-medium mt-0.5">{rest.mainMenu}</p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{rest.description}</p>

                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {rest.priceRange && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                {rest.priceRange}
                              </span>
                            )}
                            {rest.styleTags?.map((tag) => (
                              <span
                                key={tag}
                                className={`text-xs px-2 py-0.5 rounded-full border ${STYLE_TAG_COLORS[tag] || "bg-gray-100 text-gray-600 border-gray-200"}`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {rest.hours && (
                            <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400">
                              <Clock className="w-3 h-3" /> {rest.hours}
                            </div>
                          )}
                        </div>
                        {selected && (
                          <div className="w-7 h-7 bg-[#FF6B35] rounded-full flex items-center justify-center shrink-0 mt-1">
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
        nextLabel={selectedCount >= 1 ? `${selectedCount}곳 선택 완료 - 다음` : "최소 1곳 이상 선택해주세요"}
      />
    </div>
  );
}
