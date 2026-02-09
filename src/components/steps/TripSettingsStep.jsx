import { Bus, Car, Check, Calendar, Info } from "lucide-react";
import { DURATION_OPTIONS, ACCOMMODATION_TYPES } from "../../data/constants";
import StepHeader from "../ui/StepHeader";
import ProgressBar from "../ui/ProgressBar";
import BottomNav from "../ui/BottomNav";

const PRICE_OPTIONS = [
  { id: "가성비", label: "가성비", emoji: "💰", sub: "~7만원" },
  { id: "중간", label: "중간", emoji: "💳", sub: "7~15만원" },
  { id: "프리미엄", label: "프리미엄", emoji: "💎", sub: "15만원~" },
  { id: "상관없음", label: "상관없음", emoji: "🤷", sub: "다 보여주세요" },
];

export default function TripSettingsStep({ wizard }) {
  const {
    travelMode, setTravelMode,
    duration, setDuration,
    selectedAccomTypes, toggleAccomType,
    selectedPriceRange, setSelectedPriceRange,
    prevStep, nextStep, canProceed, TOTAL_STEPS,
  } = wizard;

  const showAccom = duration && duration !== "당일치기";

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <StepHeader title="여행 설정" subtitle="이동수단과 기간을 선택해주세요" onBack={prevStep} />
      <ProgressBar currentStep={4} totalSteps={TOTAL_STEPS} />

      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <div className="max-w-md mx-auto space-y-8">

          {/* ─── 이동 수단 ─── */}
          <div>
            <h3 className="text-lg font-bold text-[#1A1A2E] mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#0066CC] text-white flex items-center justify-center text-sm font-bold">1</span>
              이동 수단
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTravelMode("뚜벅이(대중교통)")}
                className={`p-5 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
                  travelMode === "뚜벅이(대중교통)"
                    ? "border-[#0066CC] bg-blue-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-blue-200"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    travelMode === "뚜벅이(대중교통)" ? "bg-[#0066CC]" : "bg-gray-100"
                  }`}>
                    <Bus className={`w-7 h-7 ${travelMode === "뚜벅이(대중교통)" ? "text-white" : "text-gray-500"}`} />
                  </div>
                  <span className="text-sm font-bold text-[#1A1A2E]">뚜벅이</span>
                  <span className="text-xs text-gray-400">(대중교통)</span>
                  {travelMode === "뚜벅이(대중교통)" && <Check className="w-5 h-5 text-[#0066CC]" />}
                </div>
              </button>

              <button
                onClick={() => setTravelMode("자차")}
                className={`p-5 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
                  travelMode === "자차"
                    ? "border-[#00A86B] bg-green-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-green-200"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    travelMode === "자차" ? "bg-[#00A86B]" : "bg-gray-100"
                  }`}>
                    <Car className={`w-7 h-7 ${travelMode === "자차" ? "text-white" : "text-gray-500"}`} />
                  </div>
                  <span className="text-sm font-bold text-[#1A1A2E]">자차</span>
                  <span className="text-xs text-gray-400">(자가용)</span>
                  {travelMode === "자차" && <Check className="w-5 h-5 text-[#00A86B]" />}
                </div>
              </button>
            </div>
          </div>

          {/* ─── 여행 기간 ─── */}
          <div>
            <h3 className="text-lg font-bold text-[#1A1A2E] mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#0066CC] text-white flex items-center justify-center text-sm font-bold">2</span>
              여행 기간
            </h3>
            <div className="space-y-3">
              {DURATION_OPTIONS.map((opt) => {
                const isSelected = duration === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setDuration(opt.id)}
                    className={`w-full p-5 rounded-2xl border-2 transition-all duration-200 active:scale-[0.98] ${
                      isSelected
                        ? "border-[#0066CC] bg-blue-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-blue-200"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isSelected ? "bg-[#0066CC]" : "bg-gray-100"
                      }`}>
                        <Calendar className={`w-6 h-6 ${isSelected ? "text-white" : "text-gray-500"}`} />
                      </div>
                      <div className="text-left flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{opt.emoji}</span>
                          <span className="text-base font-bold text-[#1A1A2E]">{opt.label}</span>
                        </div>
                        <span className="text-xs text-gray-400">{opt.sub}</span>
                      </div>
                      {isSelected && <Check className="w-6 h-6 text-[#0066CC]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── 숙소 (1박 이상일 때만) ─── */}
          {showAccom && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-lg font-bold text-[#1A1A2E] mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-purple-500 text-white flex items-center justify-center text-sm font-bold">3</span>
                숙소 유형 <span className="text-xs text-gray-400 font-normal">(선택사항)</span>
              </h3>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {ACCOMMODATION_TYPES.map((type) => {
                  const isSelected = selectedAccomTypes.includes(type.id);
                  return (
                    <button
                      key={type.id}
                      onClick={() => toggleAccomType(type.id)}
                      className={`p-3 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
                        isSelected
                          ? "border-purple-500 bg-purple-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-purple-200"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl">{type.emoji}</span>
                        <span className={`text-xs font-bold ${isSelected ? "text-purple-600" : "text-[#1A1A2E]"}`}>
                          {type.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <h4 className="text-sm font-bold text-gray-600 mb-2">가격대</h4>
              <div className="grid grid-cols-2 gap-2">
                {PRICE_OPTIONS.map((opt) => {
                  const isSelected = selectedPriceRange === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedPriceRange(opt.id)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 active:scale-95 ${
                        isSelected
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 bg-white hover:border-purple-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{opt.emoji}</span>
                        <div className="text-left">
                          <span className={`text-xs font-bold ${isSelected ? "text-purple-600" : "text-[#1A1A2E]"}`}>
                            {opt.label}
                          </span>
                          <span className="text-xs text-gray-400 block">{opt.sub}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-xl mt-4">
                <Info className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-600">선택하지 않으면 다양한 숙소를 추천해드려요</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav onNext={nextStep} canNext={canProceed} nextLabel="결과 보기" />
    </div>
  );
}
