import { X, ArrowRightLeft, Clock, MapPin } from "lucide-react";

export default function SpotSwapModal({ currentSpot, alternatives, onSwap, onClose, isDark }) {
  if (!alternatives || alternatives.length === 0) return null;

  const categoryColors = {
    "휴양/힐링": { bg: isDark ? "rgba(34,197,94,0.15)" : "#DCFCE7", text: "#22C55E" },
    "체험/액티비티": { bg: isDark ? "rgba(249,115,22,0.15)" : "#FFEDD5", text: "#F97316" },
    "맛집/미식": { bg: isDark ? "rgba(239,68,68,0.15)" : "#FEE2E2", text: "#EF4444" },
    "문화/역사": { bg: isDark ? "rgba(59,130,246,0.15)" : "#DBEAFE", text: "#3B82F6" },
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-end justify-center" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-t-3xl p-6 pb-8 max-h-[80vh] overflow-y-auto animate-slide-up"
        style={{ background: "var(--bg-primary)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-[#0066CC]" />
            <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>다른 장소로 교체</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95"
            style={{ background: "var(--bg-input)" }}
          >
            <X className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
          </button>
        </div>

        {/* 현재 스팟 */}
        <div
          className="p-4 rounded-2xl mb-4"
          style={{
            background: "var(--bg-input)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>현재 선택</div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentSpot.emoji}</span>
            <div>
              <div className="font-bold" style={{ color: "var(--text-primary)" }}>{currentSpot.name}</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>{currentSpot.region} · {currentSpot.duration || "1시간"}</div>
            </div>
          </div>
        </div>

        {/* 대안 목록 */}
        <div className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>이 장소로 교체할 수 있어요</div>
        <div className="space-y-3">
          {alternatives.map((alt, idx) => {
            const catStyle = categoryColors[alt.category] || {
              bg: isDark ? "rgba(156,163,175,0.15)" : "#F3F4F6",
              text: "var(--text-secondary)",
            };
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl border-2 transition-colors"
                style={{
                  background: "var(--bg-card)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{alt.emoji}</span>
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                        style={{ background: catStyle.bg, color: catStyle.text }}
                      >
                        {alt.category}
                      </span>
                    </div>
                    <div className="font-bold" style={{ color: "var(--text-primary)" }}>{alt.name}</div>
                    <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--text-secondary)" }}>{alt.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-blue-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {alt.travelTimeFromCurrent}분 이동
                      </span>
                      <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                        <MapPin className="w-3 h-3" /> {alt.region}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onSwap(alt)}
                    className="shrink-0 px-4 py-2 bg-[#00A86B] text-white text-sm font-bold rounded-xl active:scale-95 transition-transform hover:bg-[#009060]"
                  >
                    교체
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
