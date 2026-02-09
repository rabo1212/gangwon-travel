import { Store } from "lucide-react";

export default function RestaurantCard({ item, isDark }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{item.emoji}</span>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{
            background: isDark ? "rgba(255,107,53,0.15)" : "#FFF7ED",
            color: "#FF6B35",
          }}
        >
          {item.mealType}
        </span>
      </div>
      <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{item.name}</h3>
      {item.description && (
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{item.description}</p>
      )}

      {/* 추천 맛집 리스트 */}
      {item.restaurants && item.restaurants.length > 0 && (
        <div
          className="mt-3 rounded-xl p-3"
          style={{
            background: isDark ? "rgba(255,107,53,0.08)" : "#FFF7ED",
          }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Store className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-xs font-bold text-orange-500">
              추천 맛집 {item.restaurants.length}곳
            </span>
          </div>
          <div className="space-y-1.5">
            {item.restaurants.map((r, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
                  {idx + 1}. {r.name}
                </span>
                {r.priceRange && (
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>💰 {r.priceRange}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
