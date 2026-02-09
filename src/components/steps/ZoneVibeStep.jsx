import { Check, Star } from "lucide-react";
import { ZONES } from "../../data/zones";
import { TRAVEL_STYLES } from "../../data/constants";
import StepHeader from "../ui/StepHeader";
import ProgressBar from "../ui/ProgressBar";
import BottomNav from "../ui/BottomNav";

export default function ZoneVibeStep({ wizard, isDark }) {
  const { selectedZone, selectedVibes, selectZone, toggleVibe, prevStep, nextStep, canProceed, TOTAL_STEPS } = wizard;

  // Vibe 선택에 따른 Zone 추천 점수 계산
  const zoneScores = ZONES.map((zone) => {
    if (selectedVibes.length === 0) return { zone, score: 0 };
    const score = selectedVibes.reduce((sum, vibe) => sum + (zone.vibeWeights[vibe] || 0), 0);
    return { zone, score };
  });
  const maxScore = Math.max(...zoneScores.map((z) => z.score));

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <StepHeader
        title="Zone & Vibe 선택"
        subtitle="어떤 강원도를 만나볼까요?"
        onBack={prevStep}
      />
      <ProgressBar currentStep={1} totalSteps={TOTAL_STEPS} />

      <div className="flex-1 overflow-y-auto px-4 pb-32">
        <div className="max-w-lg mx-auto">
          {/* Zone 선택 */}
          <h3 className="text-sm font-bold uppercase tracking-wider mb-3 mt-2" style={{ color: "var(--text-muted)" }}>
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
                      ? "border-[#00A86B] shadow-lg"
                      : ""
                  }`}
                  style={{
                    background: isSelected
                      ? (isDark ? "rgba(0,168,107,0.1)" : "rgba(0,168,107,0.05)")
                      : "var(--bg-card)",
                    borderColor: isSelected ? "#00A86B" : "var(--border-color)",
                  }}
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
                  <h4 className="text-base font-bold mt-2" style={{ color: "var(--text-primary)" }}>{zone.name}</h4>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{zone.nameKo}</p>
                  <p className="text-xs mt-2 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {zone.regions.join(" · ")}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {zone.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-[10px] px-1.5 py-0.5 rounded-full"
                        style={{
                          background: "var(--bg-input)",
                          color: "var(--text-muted)",
                        }}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Vibe 선택 */}
          <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
            Vibe 선택 <span className="normal-case" style={{ color: "var(--text-muted)" }}>(1~3개)</span>
          </h3>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {TRAVEL_STYLES.map((style) => {
              const isActive = selectedVibes.includes(style.id);
              return (
                <button
                  key={style.id}
                  onClick={() => toggleVibe(style.id)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all duration-200 active:scale-95 ${
                    isActive ? "border-[#00A86B]" : ""
                  }`}
                  style={{
                    background: isActive
                      ? (isDark ? "rgba(0,168,107,0.15)" : "rgba(0,168,107,0.08)")
                      : "var(--bg-card)",
                    borderColor: isActive ? "#00A86B" : "var(--border-color)",
                    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  }}
                >
                  <span className="text-2xl">{style.emoji}</span>
                  <span className="text-xs font-medium">{style.label}</span>
                </button>
              );
            })}
          </div>

          {/* 선택 요약 */}
          {selectedZone && selectedVibes.length > 0 && (
            <div
              className="mt-4 p-4 rounded-2xl"
              style={{
                background: isDark
                  ? "linear-gradient(to right, rgba(0,168,107,0.1), rgba(0,102,204,0.1))"
                  : "linear-gradient(to right, rgba(0,168,107,0.05), rgba(0,102,204,0.05))",
                border: "1px solid rgba(0,168,107,0.2)",
              }}
            >
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                <span className="text-lg mr-1">{selectedZone.emoji}</span>
                <strong style={{ color: "var(--text-primary)" }}>{selectedZone.name}</strong>
                <span style={{ color: "var(--text-muted)" }}> 에서 </span>
                {selectedVibes.map((v) => {
                  const s = TRAVEL_STYLES.find((t) => t.id === v);
                  return (
                    <span
                      key={v}
                      className="inline-flex items-center gap-0.5 mx-0.5 px-2 py-0.5 rounded-full text-xs"
                      style={{
                        background: "var(--bg-input)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {s?.emoji} {s?.label}
                    </span>
                  );
                })}
                <span style={{ color: "var(--text-muted)" }}> 여행을 시작합니다</span>
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNav
        onNext={nextStep}
        canNext={canProceed}
        nextLabel={canProceed ? "다음" : "Zone과 Vibe를 선택해주세요"}
      />
    </div>
  );
}
