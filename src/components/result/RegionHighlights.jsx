import { Star } from "lucide-react";
import TagBadge from "../ui/TagBadge";
import { ALL_RESTAURANTS } from "../../data/restaurants";
import { STYLE_EMOJIS } from "../../data/constants";

export default function RegionHighlights({ selectedRegions }) {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#FF6B35] text-white flex items-center justify-center">
          <Star className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-[#1A1A2E]">지역 맛집 한눈에 보기</h2>
      </div>

      <div className="space-y-3">
        {selectedRegions.map((regionName) => {
          const restaurants = ALL_RESTAURANTS[regionName] || [];
          return (
            <div key={regionName} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#1A1A2E] mb-3">{regionName} 맛집</h3>
              <div className="space-y-2">
                {restaurants.slice(0, 5).map((rest, rIdx) => (
                  <div key={rIdx} className="flex items-center gap-3 p-3 bg-[#F5F7FA] rounded-xl">
                    <span className="text-xl">{rest.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1A1A2E] text-sm">{rest.name}</p>
                      <p className="text-xs text-gray-500">{rest.mainMenu} · {rest.genre}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {rest.styleTags?.slice(0, 2).map((tag) => (
                        <TagBadge key={tag} tag={tag} emoji={STYLE_EMOJIS[tag]} size="sm" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
