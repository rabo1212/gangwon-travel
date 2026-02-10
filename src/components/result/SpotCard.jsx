import { useState } from "react";
import { MapPin, Clock, Lightbulb, ArrowRightLeft, Heart } from "lucide-react";
import { getSpotImageUrl, getSpotGradient } from "../../utils/spotImages";

export default function SpotCard({ item, isDark, onSwap, spotIndex, isFavorited, onToggleFavorite, onDetailOpen }) {
  const [imgError, setImgError] = useState(false);

  const categoryColors = {
    "휴양/힐링": { bg: isDark ? "rgba(34,197,94,0.2)" : "#D1FAE5", text: isDark ? "#4ADE80" : "#065F46" },
    "체험/액티비티": { bg: isDark ? "rgba(249,115,22,0.2)" : "#FED7AA", text: isDark ? "#FB923C" : "#9A3412" },
    "맛집/미식": { bg: isDark ? "rgba(239,68,68,0.2)" : "#FECACA", text: isDark ? "#F87171" : "#991B1B" },
    "문화/역사": { bg: isDark ? "rgba(59,130,246,0.2)" : "#BFDBFE", text: isDark ? "#60A5FA" : "#1E40AF" },
    "포토스팟/감성": { bg: isDark ? "rgba(236,72,153,0.2)" : "#FBCFE8", text: isDark ? "#F472B6" : "#9D174D" },
    "자연/트레킹": { bg: isDark ? "rgba(16,185,129,0.2)" : "#A7F3D0", text: isDark ? "#34D399" : "#065F46" },
  };

  const catStyle = categoryColors[item.category] || {
    bg: isDark ? "rgba(156,163,175,0.2)" : "#E5E7EB",
    text: isDark ? "#9CA3AF" : "#374151",
  };

  const imageUrl = getSpotImageUrl(item);
  const gradient = getSpotGradient(item.category);
  const showImage = imageUrl && !imgError;

  return (
    <div className="-mx-5 -mt-5">
      {/* 이미지 영역 (4:3 비율) */}
      <div
        className="relative overflow-hidden rounded-t-2xl cursor-pointer"
        onClick={() => onDetailOpen?.(item)}
      >
        {showImage ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full aspect-[4/3] object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div
            className={`w-full aspect-[4/3] bg-gradient-to-br ${gradient} flex flex-col items-center justify-center gap-2`}
          >
            <span className="text-5xl">{item.emoji}</span>
            <span className="text-white/70 text-xs font-medium">{item.region}</span>
          </div>
        )}

        {/* 번호 뱃지 */}
        {spotIndex !== undefined && (
          <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-xs font-extrabold text-[#0066CC] shadow-md z-10">
            {spotIndex}
          </div>
        )}

        {/* 하트 버튼 (44px 터치 타겟) */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item);
            }}
            className="absolute top-3 right-3 w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform z-10"
            aria-label={isFavorited ? "찜 해제" : "찜하기"}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorited ? "fill-red-500 text-red-500" : "text-white"
              }`}
            />
          </button>
        )}

        {/* 그라데이션 오버레이 + 장소명 */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
          <span className="text-white font-bold drop-shadow-sm">
            {item.emoji} {item.name}
          </span>
        </div>
      </div>

      {/* 카드 본문 */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: catStyle.bg, color: catStyle.text }}
          >
            {item.category}
          </span>
          {item.photoSpot && (
            <span
              className="text-xs font-medium px-2 py-1 rounded-full"
              style={{
                background: isDark ? "rgba(236,72,153,0.2)" : "#FCE7F3",
                color: isDark ? "#F472B6" : "#9D174D",
              }}
            >
              📸 포토
            </span>
          )}
          {onSwap && (
            <button
              onClick={(e) => { e.stopPropagation(); onSwap(); }}
              className="ml-auto flex items-center gap-1 text-xs text-[#0066CC] font-bold px-3 py-2 rounded-lg active:scale-95 transition-all min-h-[44px]"
              style={{ background: isDark ? "rgba(0,102,204,0.15)" : "#EFF6FF" }}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              교체
            </button>
          )}
        </div>

        <p className="text-sm mt-1 line-clamp-2" style={{ color: "var(--text-secondary)" }}>{item.description}</p>

        {item.address && (
          <p className="text-xs mt-2.5 flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
            <MapPin className="w-3.5 h-3.5 shrink-0" /> {item.address}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 mt-2">
          {item.hours && item.hours !== "상시" && (
            <span className="text-xs flex items-center gap-1" style={{ color: isDark ? "#60A5FA" : "#2563EB" }}>
              <Clock className="w-3.5 h-3.5" /> {item.hours}
            </span>
          )}
          {item.duration && (
            <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
              ⏱️ {item.duration}
            </span>
          )}
        </div>

        {item.tip && (
          <div
            className="flex items-start gap-2 mt-3 p-3 rounded-xl"
            style={{ background: isDark ? "rgba(245,158,11,0.12)" : "#FFFBEB" }}
          >
            <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs" style={{ color: isDark ? "#FBBF24" : "#B45309" }}>{item.tip}</p>
          </div>
        )}
      </div>
    </div>
  );
}
