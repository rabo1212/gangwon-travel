import { useState } from "react";
import { MapPin, Lightbulb } from "lucide-react";

const TYPE_EMOJIS = {
  "호텔": "🏨", "리조트": "🏖️", "펜션": "🏡",
  "에어비앤비": "🏠", "게스트하우스": "🛏️", "한옥스테이": "🏯",
};

export default function AccommodationCard({ item, isDark }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div>
      {/* TourAPI 이미지가 있으면 표시 */}
      {item.imageUrl && !imgError && (
        <div className="-mx-5 -mt-5 mb-4">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full aspect-[5/2] object-cover rounded-t-2xl"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        </div>
      )}
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xl">{TYPE_EMOJIS[item.type] || "🏨"}</span>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{
            background: isDark ? "rgba(147,51,234,0.2)" : "#F3E8FF",
            color: isDark ? "#C084FC" : "#7C3AED",
          }}
        >
          숙소
        </span>
        <span
          className="text-xs font-medium px-2 py-1 rounded-full"
          style={{
            background: isDark ? "rgba(147,51,234,0.1)" : "#EDE9FE",
            color: isDark ? "#A78BFA" : "#6D28D9",
          }}
        >
          {item.type}
        </span>
      </div>
      <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{item.name}</h3>
      {item.description && (
        <p className="text-sm mt-1 line-clamp-2" style={{ color: "var(--text-secondary)" }}>{item.description}</p>
      )}
      {item.address && (
        <p className="text-xs mt-2.5 flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
          <MapPin className="w-3.5 h-3.5 shrink-0" /> {item.address}
        </p>
      )}

      {/* 편의시설 태그 */}
      {item.features && item.features.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {item.features.map((f) => (
            <span
              key={f}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "var(--bg-input)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              {f}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mt-2.5 text-xs" style={{ color: "var(--text-secondary)" }}>
        {item.priceRange && <span>💰 {item.priceRange}</span>}
        {item.checkIn && <span>🔑 체크인 {item.checkIn}</span>}
        {item.checkOut && <span>체크아웃 {item.checkOut}</span>}
      </div>

      {item.tip && (
        <div
          className="flex items-start gap-2 mt-3 p-3 rounded-xl"
          style={{ background: isDark ? "rgba(147,51,234,0.1)" : "#FAF5FF" }}
        >
          <Lightbulb className="w-4 h-4 mt-0.5 shrink-0" style={{ color: isDark ? "#C084FC" : "#7C3AED" }} />
          <p className="text-xs" style={{ color: isDark ? "#C084FC" : "#6D28D9" }}>{item.tip}</p>
        </div>
      )}

      <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>📍 {item.region}</p>
    </div>
  );
}
