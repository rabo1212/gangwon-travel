import { Check, Star } from "lucide-react";
import { ZONES } from "../../data/zones";
import { TRAVEL_STYLES } from "../../data/constants";
import StepHeader from "../ui/StepHeader";
import ProgressBar from "../ui/ProgressBar";
import BottomNav from "../ui/BottomNav";

export default function ZoneVibeStep({ wizard }) {
  const { selectedZone, selectedVibes, selectZone, toggleVibe, prevStep, nextStep, canProceed, TOTAL_STEPS } = wizard;

  // Vibe 선택에 따른 Zone 추천 점수 계산
  const zoneScores = ZONES.map((zone) => {
    if (selectedVibes.length === 0) return { zone, score: 0 };
    const score = selectedVibes.reduce((sum, vibe) => sum + (zone.vibeWeights[vibe] || 0), 0);
    return { zone, score };
  });
  const maxScore = Math.max(...zoneScores.map((z) => z.score));

  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f1a]">
      <StepHeader
        title="Zone & Vibe 선택"
        subtitle="어떤 강원도를 채굴할까요?"
        onBack={prevStep}
        dark
      />
      <ProgressBar currentStep={1} totalSteps={TOTAL_STEPS} />

      <div className="flex-1 overflow-y-auto px-4 pb-32">
        <div className="max-w-lg mx-auto">
          {/* Zone 선택 */}
          <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-3 mt-2">
            Zone 선택
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {zoneScores.map(({ zone, score }) => {
              const isSelected = selectedZone?.id === zone.id;
              const isRecommended = selectedVibes.length > 0 && score === maxScore && maxScore > 0;
              return (
                <button
                  key={zone.id}
                  onClick={() => selectZone(zone)}
                  className={`relative text-left p-4 rounded-2xl border-2 transition-all duration-200 active:scale-[0.97] ${
                    isSelected
                      ? "border-[#00A86B] bg-[#00A86B]/10 shadow-lg shadow-[#00A86B]/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  {/* 추천 뱃지 */}
                  {isRecommended && !isSelected && (
                    <div className="absolute -top-2 -right-2 flex items-center gap-0.5 px-2 py-0.5 bg-[#FF6B35] rounded-full text-[10px] font-bold text-white">
                      <Star className="w-2.5 h-2.5" />
                      추천
                    </div>
                  )}
                  {/* 선택 체크 */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#00A86B] flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <span className="text-3xl">{zone.emoji}</span>
                  <h4 className="text-base font-bold text-white mt-2">{zone.name}</h4>
                  <p className="text-xs text-white/40 mt-0.5">{zone.nameKo}</p>
                  <p className="text-xs text-white/30 mt-2 leading-relaxed">
                    {zone.regions.join(" · ")}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {zone.keywords.map((kw) => (
                      <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/50">
                        {kw}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Vibe 선택 */}
          <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-3">
            Vibe 선택 <span className="text-white/30 normal-case">(1~3개)</span>
          </h3>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {TRAVEL_STYLES.map((style) => {
              const isActive = selectedVibes.includes(style.id);
              return (
                <button
                  key={style.id}
                  onClick={() => toggleVibe(style.id)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all duration-200 active:scale-95 ${
                    isActive
                      ? "border-[#00A86B] bg-[#00A86B]/15 text-white"
                      : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"
                  }`}
                >
                  <span className="text-2xl">{style.emoji}</span>
                  <span className="text-xs font-medium">{style.label}</span>
                </button>
              );
            })}
          </div>

          {/* 선택 요약 */}
          {selectedZone && selectedVibes.length > 0 && (
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#00A86B]/10 to-[#0066CC]/10 border border-[#00A86B]/20">
              <p className="text-sm text-white/70">
                <span className="text-lg mr-1">{selectedZone.emoji}</span>
                <strong className="text-white">{selectedZone.name}</strong>
                <span className="text-white/40"> 에서 </span>
                {selectedVibes.map((v) => {
                  const s = TRAVEL_STYLES.find((t) => t.id === v);
                  return (
                    <span key={v} className="inline-flex items-center gap-0.5 mx-0.5 px-2 py-0.5 bg-white/10 rounded-full text-xs text-white/80">
                      {s?.emoji} {s?.label}
                    </span>
                  );
                })}
                <span className="text-white/40"> 여행 데이터를 채굴합니다</span>
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNav
        onNext={nextStep}
        canNext={canProceed}
        nextLabel={canProceed ? "다음" : "Zone과 Vibe를 선택해주세요"}
        dark
      />
    </div>
  );
}
