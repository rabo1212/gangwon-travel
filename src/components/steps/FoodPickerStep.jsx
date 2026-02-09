import { useState, useMemo } from "react";
import { Check, Store } from "lucide-react";
import { REGIONAL_FOODS } from "../../data/regionalFoods";
import StepHeader from "../ui/StepHeader";
import ProgressBar from "../ui/ProgressBar";
import BottomNav from "../ui/BottomNav";

export default function FoodPickerStep({ wizard }) {
  const { selectedRegions, selectedFoods, toggleFood, prevStep, nextStep, canProceed, TOTAL_STEPS } = wizard;
  const [activeTab, setActiveTab] = useState(selectedRegions[0] || "");

  const foods = useMemo(() => {
    return REGIONAL_FOODS[activeTab] || [];
  }, [activeTab]);

  // 카테고리별 그룹
  const foodsByCategory = useMemo(() => {
    const groups = {};
    foods.forEach((food) => {
      const cat = food.category || "식사";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push({ ...food, region: activeTab });
    });
    return groups;
  }, [foods, activeTab]);

  const selectedCount = selectedFoods.length;

  const CATEGORY_EMOJIS = { "식사": "🍽️", "간식/카페": "☕" };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <StepHeader
        title="먹어보고 싶은 음식"
        subtitle={`${activeTab}의 대표 음식을 골라주세요`}
        onBack={prevStep}
      />
      <ProgressBar currentStep={3} totalSteps={TOTAL_STEPS} />

      <div className="flex-1 overflow-y-auto px-4 pb-32">
        <div className="max-w-lg mx-auto">
          {/* 지역 탭 */}
          {selectedRegions.length > 1 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {selectedRegions.map((region) => (
                <button
                  key={region}
                  onClick={() => setActiveTab(region)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    activeTab === region
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          )}

          {/* 선택된 음식 칩 */}
          {selectedCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 p-3 bg-orange-50 rounded-xl">
              {selectedFoods.map((food) => (
                <span
                  key={food.id}
                  className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white rounded-full text-sm font-medium"
                >
                  {food.emoji} {food.name}
                  <button
                    onClick={() => toggleFood(food)}
                    aria-label={`${food.name} 선택 해제`}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* 카테고리별 음식 목록 */}
          {Object.entries(foodsByCategory).map(([category, items]) => (
            <div key={category} className="mb-6">
              <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>{CATEGORY_EMOJIS[category] || "🍽️"}</span>
                {category}
              </h3>
              <div className="space-y-3">
                {items.map((food) => {
                  const isSelected = selectedFoods.some((f) => f.id === food.id);
                  return (
                    <button
                      key={food.id}
                      onClick={() => toggleFood(food)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 active:scale-[0.98] ${
                        isSelected
                          ? "border-orange-500 bg-orange-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-orange-200 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl mt-0.5">{food.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-[#1A1A2E]">{food.name}</h4>
                            {isSelected && (
                              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{food.description}</p>
                          {/* 추천 식당 미리보기 */}
                          <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                            <Store className="w-3 h-3" />
                            <span>
                              추천 맛집 {food.restaurants.length}곳
                              {food.restaurants.length > 0 && (
                                <> — {food.restaurants.map((r) => r.name).join(", ")}</>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {foods.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <span className="text-4xl">🍽️</span>
              <p className="mt-2">이 지역의 음식 정보가 준비 중입니다</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav
        onNext={nextStep}
        canNext={canProceed}
        nextLabel={selectedCount > 0 ? `${selectedCount}개 선택 완료 — 다음` : "1개 이상 선택해주세요"}
      />
    </div>
  );
}
