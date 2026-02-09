import { MapPin } from "lucide-react";
import { ACCOMMODATION_TYPE_COLORS } from "../../data/constants";

const TYPE_EMOJIS = {
  "호텔": "🏨", "리조트": "🏖️", "펜션": "🏡",
  "에어비앤비": "🏠", "게스트하우스": "🛏️", "한옥스테이": "🏯",
};

export default function AccommodationCard({ item }) {
  const typeColor = ACCOMMODATION_TYPE_COLORS[item.type] || "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{TYPE_EMOJIS[item.type] || "🏨"}</span>
        <span className="text-xs font-medium px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
          숙소
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full border ${typeColor}`}>
          {item.type}
        </span>
      </div>
      <h3 className="text-lg font-bold text-[#1A1A2E]">{item.name}</h3>
      {item.description && (
        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
      )}
      {item.address && (
        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {item.address}
        </p>
      )}

      {/* 편의시설 태그 */}
      {item.features && item.features.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {item.features.map((f) => (
            <span key={f} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
              {f}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
        {item.priceRange && <span>💰 {item.priceRange}</span>}
        {item.checkIn && <span>🔑 체크인 {item.checkIn}</span>}
        {item.checkOut && <span>체크아웃 {item.checkOut}</span>}
      </div>

      {item.tip && (
        <div className="mt-2 bg-purple-50 rounded-lg p-2.5">
          <p className="text-xs text-purple-700">💡 {item.tip}</p>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-1">📍 {item.region}</p>
    </div>
  );
}
