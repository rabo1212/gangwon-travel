import { MapPin, Clock, Lightbulb, ArrowRightLeft } from "lucide-react";

export default function SpotCard({ item, onSwap }) {
  const categoryColors = {
    "휴양/힐링": "bg-green-100 text-green-700",
    "체험/액티비티": "bg-orange-100 text-orange-700",
    "맛집/미식": "bg-red-100 text-red-700",
    "문화/역사": "bg-blue-100 text-blue-700",
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{item.emoji}</span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[item.category] || "bg-gray-100 text-gray-700"}`}>
          {item.category}
        </span>
        {item.photoSpot && <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">📸 포토</span>}
        {onSwap && (
          <button
            onClick={onSwap}
            className="ml-auto flex items-center gap-1 text-xs text-[#0066CC] font-medium px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 active:scale-95 transition-all"
          >
            <ArrowRightLeft className="w-3 h-3" />
            교체
          </button>
        )}
      </div>
      <h3 className="text-lg font-bold text-[#1A1A2E]">{item.name}</h3>
      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
      {item.address && (
        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
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
          <span className="text-xs text-gray-500 flex items-center gap-1">
            ⏱️ {item.duration}
          </span>
        )}
        <span className="text-xs text-gray-400">📍 {item.region}</span>
      </div>
      {item.tip && (
        <div className="flex items-start gap-1.5 mt-2 p-2 bg-amber-50 rounded-lg">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">{item.tip}</p>
        </div>
      )}
    </div>
  );
}
