import { useState } from "react";
import { Store } from "lucide-react";
import { getFoodImageUrl } from "../../utils/spotImages";

export default function RestaurantCard({ item, isDark }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = getFoodImageUrl(item);
  const showImage = imageUrl && !imgError;

  return (
    <div>
      {/* 음식 이미지 */}
      <div className="-mx-5 -mt-5 mb-4">
        {showImage ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full aspect-[5/2] object-cover rounded-t-2xl"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-[5/2] rounded-t-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center gap-2">
            <span className="text-4xl">{item.emoji}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xl">{item.emoji}</span>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{
            background: isDark ? "rgba(255,107,53,0.2)" : "#FED7AA",
            color: isDark ? "#FB923C" : "#9A3412",
          }}
        >
          {item.mealType}
        </span>
      </div>
      <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{item.name}</h3>
      {item.description && (
        <p className="text-sm mt-1 line-clamp-2" style={{ color: "var(--text-secondary)" }}>{item.description}</p>
      )}

      {item.restaurants && item.restaurants.length > 0 && (
        <div
          className="mt-3 rounded-xl p-3"
          style={{ background: isDark ? "rgba(255,107,53,0.1)" : "#FFF7ED" }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Store className="w-3.5 h-3.5" style={{ color: isDark ? "#FB923C" : "#EA580C" }} />
            <span className="text-xs font-bold" style={{ color: isDark ? "#FB923C" : "#EA580C" }}>
              추천 맛집 {item.restaurants.length}곳
            </span>
          </div>
          <div className="space-y-2">
            {item.restaurants.map((r, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  {idx + 1}. {r.name}
                </span>
                {r.priceRange && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{
                    background: isDark ? "rgba(255,255,255,0.05)" : "#F3F4F6",
                    color: "var(--text-muted)",
                  }}>
                    💰 {r.priceRange}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
