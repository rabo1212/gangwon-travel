import { useState } from "react";
import { MapPin, Clock, Lightbulb, ArrowRightLeft } from "lucide-react";
import { getSpotImageUrl, getSpotGradient } from "../../utils/spotImages";

export default function SpotCard({ item, isDark, onSwap }) {
  const [imgError, setImgError] = useState(false);

  const categoryColors = {
    "휴양/힐링": { bg: isDark ? "rgba(34,197,94,0.15)" : "#DCFCE7", text: "#22C55E" },
    "체험/액티비티": { bg: isDark ? "rgba(249,115,22,0.15)" : "#FFEDD5", text: "#F97316" },
    "맛집/미식": { bg: isDark ? "rgba(239,68,68,0.15)" : "#FEE2E2", text: "#EF4444" },
    "문화/역사": { bg: isDark ? "rgba(59,130,246,0.15)" : "#DBEAFE", text: "#3B82F6" },
  };

  const catStyle = categoryColors[item.category] || {
    bg: isDark ? "rgba(156,163,175,0.15)" : "#F3F4F6",
    text: "var(--text-secondary)",
  };

  const imageUrl = getSpotImageUrl(item);
  const gradient = getSpotGradient(item.category);

  return (
    <div className="-mx-5 -mt-5">
      {/* 대표 이미지 */}
      <div className="relative overflow-hidden rounded-t-2xl">
        {!imgError ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-[140px] sm:h-[120px] object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div
            className={`w-full h-[120px] bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <span className="text-5xl">{item.emoji}</span>
          </div>
        )}
        {/* 그라데이션 오버레이 + 장소명 */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
          <span className="text-white text-sm font-bold drop-shadow-sm">
            {item.emoji} {item.name}
          </span>
        </div>
      </div>

      {/* 카드 본문 */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: catStyle.bg, color: catStyle.text }}
          >
            {item.category}
          </span>
          {item.photoSpot && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: isDark ? "rgba(236,72,153,0.15)" : "#FCE7F3",
                color: "#EC4899",
              }}
            >
              📸 포토
            </span>
          )}
          {onSwap && (
            <button
              onClick={onSwap}
              className="ml-auto flex items-center gap-1 text-xs text-[#0066CC] font-medium px-3 py-1.5 rounded-lg active:scale-95 transition-all min-h-[36px]"
              style={{ background: isDark ? "rgba(0,102,204,0.15)" : "#EFF6FF" }}
            >
              <ArrowRightLeft className="w-3 h-3" />
              교체
            </button>
          )}
        </div>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{item.description}</p>
        {item.address && (
          <p className="text-xs mt-2 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
            <MapPin className="w-3 h-3" /> {item.address}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3 mt-2">
          {item.hours && item.hours !== "상시" && (
            <span className="text-xs text-blue-500 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {item.hours}
            </span>
          )}
          {item.duration && (
            <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
              ⏱️ {item.duration}
            </span>
          )}
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>📍 {item.region}</span>
        </div>
        {item.tip && (
          <div
            className="flex items-start gap-1.5 mt-2 p-2 rounded-lg"
            style={{
              background: isDark ? "rgba(245,158,11,0.1)" : "#FFFBEB",
            }}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-500">{item.tip}</p>
          </div>
        )}
      </div>
    </div>
  );
}
