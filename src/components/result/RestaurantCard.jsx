import { MapPin } from "lucide-react";
import TagBadge from "../ui/TagBadge";
import { STYLE_EMOJIS, GENRE_EMOJIS } from "../../data/constants";

export default function RestaurantCard({ item }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{item.emoji}</span>
        <span className="text-xs font-medium px-2 py-0.5 bg-orange-100 text-[#FF6B35] rounded-full">
          {item.mealType}
        </span>
        {item.genre && (
          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
            {GENRE_EMOJIS[item.genre] || ""} {item.genre}
          </span>
        )}
      </div>
      <h3 className="text-lg font-bold text-[#1A1A2E]">{item.name}</h3>
      {item.mainMenu && (
        <p className="text-sm text-gray-600 mt-1">추천 메뉴: <strong>{item.mainMenu}</strong></p>
      )}
      {item.description && (
        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
      )}
      {item.address && (
        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {item.address}
        </p>
      )}

      {/* 스타일 태그 */}
      {item.styleTags && item.styleTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {item.styleTags.map((tag) => (
            <TagBadge key={tag} tag={tag} emoji={STYLE_EMOJIS[tag]} />
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
        {item.priceRange && <span>💰 {item.priceRange}</span>}
        {item.hours && <span>🕐 {item.hours}</span>}
      </div>
      <p className="text-xs text-gray-400 mt-1">📍 {item.region}</p>
    </div>
  );
}
