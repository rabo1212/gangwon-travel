import { Check } from "lucide-react";
import { REGIONS, REGION_NAMES } from "../../data/regions";
import StepHeader from "../ui/StepHeader";
import ProgressBar from "../ui/ProgressBar";
import BottomNav from "../ui/BottomNav";

export default function RegionStep({ wizard }) {
  const { selectedRegions, toggleRegion, prevStep, nextStep, canProceed, TOTAL_STEPS } = wizard;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <StepHeader
        title="여행 지역 선택"
        subtitle={`방문하고 싶은 지역을 선택해주세요 (${selectedRegions.length}/3)`}
        onBack={prevStep}
      />
      <ProgressBar currentStep={1} totalSteps={TOTAL_STEPS} />
      <div className="flex-1 overflow-y-auto px-4 pb-32">
        <div className="max-w-lg mx-auto">
          {selectedRegions.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 p-3 bg-blue-50 rounded-xl">
              {selectedRegions.map((r) => (
                <span key={r} className="flex items-center gap-1 px-3 py-1.5 bg-[#0066CC] text-white rounded-full text-sm font-medium">
                  {REGIONS[r]?.emoji} {r}
                  <button onClick={() => toggleRegion(r)} aria-label={`${r} 선택 해제`} className="ml-1 hover:bg-white/20 rounded-full p-0.5">&times;</button>
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            {REGION_NAMES.map((region) => {
              const data = REGIONS[region];
              const isSelected = selectedRegions.includes(region);
              const isDisabled = selectedRegions.length >= 3 && !isSelected;
              return (
                <button
                  key={region}
                  onClick={() => !isDisabled && toggleRegion(region)}
                  className={`relative p-4 rounded-2xl border-2 transition-all duration-200 transform active:scale-95 ${
                    isSelected
                      ? "border-[#0066CC] bg-blue-50 shadow-md"
                      : isDisabled
                      ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                      : "border-gray-200 bg-white hover:border-blue-200 hover:shadow-sm"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#0066CC] rounded-full flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div className="text-2xl mb-1">{data?.emoji}</div>
                  <div className="text-sm font-bold text-[#1A1A2E]">{region}</div>
                </button>
              );
            })}
          </div>
          <p className="text-center text-sm text-gray-400 mt-4">최대 3개 지역까지 선택 가능합니다</p>
        </div>
      </div>
      <BottomNav onNext={nextStep} canNext={canProceed} />
    </div>
  );
}
