import { X, ArrowRightLeft, Clock, MapPin } from "lucide-react";

export default function SpotSwapModal({ currentSpot, alternatives, onSwap, onClose }) {
  if (!alternatives || alternatives.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-end justify-center" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl p-6 pb-8 max-h-[80vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-[#0066CC]" />
            <h3 className="text-lg font-bold text-[#1A1A2E]">다른 장소로 교체</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:scale-95">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* 현재 스팟 */}
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 mb-4">
          <div className="text-xs text-gray-400 mb-1">현재 선택</div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentSpot.emoji}</span>
            <div>
              <div className="font-bold text-[#1A1A2E]">{currentSpot.name}</div>
              <div className="text-xs text-gray-400">{currentSpot.region} · {currentSpot.duration || "1시간"}</div>
            </div>
          </div>
        </div>

        {/* 대안 목록 */}
        <div className="text-xs text-gray-400 mb-3">이 장소로 교체할 수 있어요</div>
        <div className="space-y-3">
          {alternatives.map((alt, idx) => (
            <div key={idx} className="p-4 rounded-2xl border-2 border-gray-100 bg-white hover:border-[#00A86B]/50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{alt.emoji}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                      alt.category === "휴양/힐링" ? "bg-green-100 text-green-700" :
                      alt.category === "체험/액티비티" ? "bg-orange-100 text-orange-700" :
                      alt.category === "맛집/미식" ? "bg-red-100 text-red-700" :
                      alt.category === "문화/역사" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {alt.category}
                    </span>
                  </div>
                  <div className="font-bold text-[#1A1A2E]">{alt.name}</div>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{alt.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-blue-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {alt.travelTimeFromCurrent}분 이동
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
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
          ))}
        </div>
      </div>
    </div>
  );
}
