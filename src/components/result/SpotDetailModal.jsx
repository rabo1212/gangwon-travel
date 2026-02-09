import { X, MapPin, Clock, ExternalLink, ArrowRightLeft, Lightbulb, Navigation } from "lucide-react";
import { getSpotImageUrl } from "../../utils/spotImages";

export default function SpotDetailModal({ spot, isDark, onClose, hasAlternatives, onSwapRequest }) {
  if (!spot) return null;

  const images = [
    getSpotImageUrl(spot, 600, 300),
    getSpotImageUrl({ ...spot, name: spot.name + "_2" }, 300, 200),
    getSpotImageUrl({ ...spot, name: spot.name + "_3" }, 300, 200),
  ];

  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(spot.name + " " + (spot.region || "강원"))}`;
  const kakaoMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(spot.name)}`;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slide-up"
        style={{ background: "var(--bg-primary)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 드래그 핸들 */}
        <div className="flex justify-center py-3 sticky top-0 z-10" style={{ background: "var(--bg-primary)" }}>
          <div className="w-10 h-1 rounded-full" style={{ background: "var(--text-muted)" }} />
        </div>

        {/* 이미지 갤러리 */}
        <div className="px-4 pb-3">
          <div className="grid grid-cols-3 gap-1.5 rounded-xl overflow-hidden">
            <img
              src={images[0]}
              alt={spot.name}
              className="col-span-2 w-full h-[160px] object-cover"
              loading="lazy"
            />
            <div className="flex flex-col gap-1.5">
              <img
                src={images[1]}
                alt={spot.name}
                className="w-full h-[77px] object-cover"
                loading="lazy"
              />
              <img
                src={images[2]}
                alt={spot.name}
                className="w-full h-[77px] object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* 장소 정보 */}
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              {spot.emoji} {spot.name}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "var(--bg-input)" }}
            >
              <X className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            </button>
          </div>

          {spot.category && (
            <span
              className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-3"
              style={{
                background: isDark ? "rgba(0,102,204,0.15)" : "#DBEAFE",
                color: "#3B82F6",
              }}
            >
              {spot.category}
            </span>
          )}

          <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
            {spot.description}
          </p>

          {/* 상세 정보 */}
          <div className="space-y-2.5 mb-4">
            {spot.address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--text-muted)" }} />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{spot.address}</span>
              </div>
            )}
            {spot.hours && (
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />
                <span className="text-sm text-blue-500">{spot.hours}</span>
              </div>
            )}
            {spot.duration && (
              <div className="flex items-start gap-2">
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>⏱️ 소요시간: {spot.duration}</span>
              </div>
            )}
          </div>

          {/* 꿀팁 */}
          {spot.tip && (
            <div
              className="flex items-start gap-2 p-3 rounded-xl mb-4"
              style={{ background: isDark ? "rgba(245,158,11,0.1)" : "#FFFBEB" }}
            >
              <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-sm text-amber-500">{spot.tip}</p>
            </div>
          )}

          {/* 외부 링크 버튼들 */}
          <div className="flex gap-2 mb-3">
            <a
              href={naverMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
              style={{
                background: isDark ? "rgba(0,168,107,0.15)" : "#F0FDF4",
                color: "#00A86B",
                border: `1px solid ${isDark ? "rgba(0,168,107,0.3)" : "#BBF7D0"}`,
              }}
            >
              <Navigation className="w-4 h-4" />
              네이버 지도
            </a>
            <a
              href={kakaoMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
              style={{
                background: isDark ? "rgba(0,102,204,0.15)" : "#EFF6FF",
                color: "#0066CC",
                border: `1px solid ${isDark ? "rgba(0,102,204,0.3)" : "#BFDBFE"}`,
              }}
            >
              <ExternalLink className="w-4 h-4" />
              카카오맵
            </a>
          </div>

          {/* 교체 버튼 */}
          {hasAlternatives && (
            <button
              onClick={onSwapRequest}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
              style={{
                background: "var(--bg-input)",
                color: "var(--text-secondary)",
              }}
            >
              <ArrowRightLeft className="w-4 h-4" />
              다른 장소로 교체
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
