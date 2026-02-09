import { Store } from "lucide-react";

export default function RestaurantCard({ item }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{item.emoji}</span>
        <span className="text-xs font-medium px-2 py-0.5 bg-orange-100 text-[#FF6B35] rounded-full">
          {item.mealType}
        </span>
      </div>
      <h3 className="text-lg font-bold text-[#1A1A2E]">{item.name}</h3>
      {item.description && (
        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
      )}

      {/* 추천 맛집 리스트 */}
      {item.restaurants && item.restaurants.length > 0 && (
        <div className="mt-3 bg-orange-50 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Store className="w-3.5 h-3.5 text-orange-600" />
            <span className="text-xs font-bold text-orange-700">
              추천 맛집 {item.restaurants.length}곳
            </span>
          </div>
          <div className="space-y-1.5">
            {item.restaurants.map((r, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 font-medium">
                  {idx + 1}. {r.name}
                </span>
                {r.priceRange && (
                  <span className="text-xs text-gray-400">💰 {r.priceRange}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
