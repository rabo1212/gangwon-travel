import { Bed } from "lucide-react";
import SpotCard from "./SpotCard";
import RestaurantCard from "./RestaurantCard";
import AccommodationCard from "./AccommodationCard";
import TravelSegment from "./TravelSegment";
import { haversineDistance } from "../../utils/distance";

export default function ItineraryDay({
  day, dayIndex, alternatives, onSwapRequest, travelMode, isDark,
  spotStartIndex = 1, onToggleFavorite, favoriteSet, onDetailOpen,
  onCardClick, cardRefsMap,
}) {
  let spotCounter = spotStartIndex;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#0066CC] text-white flex items-center justify-center font-bold text-lg">
          {day.day}
        </div>
        <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{day.title}</h2>
      </div>

      <div
        className="space-y-3 ml-5 pl-6"
        style={{ borderLeft: `2px solid ${isDark ? "rgba(0,102,204,0.3)" : "#DBEAFE"}` }}
      >
        {day.schedule.map((item, idx) => {
          const prevItem = idx > 0 ? day.schedule[idx - 1] : null;
          const showTravel =
            prevItem &&
            prevItem.latitude &&
            prevItem.longitude &&
            item.latitude &&
            item.longitude;

          let travelInfo = null;
          if (showTravel) {
            const straightDist = haversineDistance(
              prevItem.latitude,
              prevItem.longitude,
              item.latitude,
              item.longitude
            );
            const roadDist = straightDist * 1.3;
            const speed = travelMode === "자차" ? 40 : 25;
            const minutes = (roadDist / speed) * 60;
            travelInfo = { distanceKm: roadDist, timeMinutes: minutes };
          }

          const currentSpotIndex = item.type === "spot" ? spotCounter++ : undefined;

          return (
            <div key={idx}>
              {travelInfo && (
                <TravelSegment
                  distanceKm={travelInfo.distanceKm}
                  timeMinutes={travelInfo.timeMinutes}
                  travelMode={travelMode}
                  isDark={isDark}
                />
              )}
              <div
                ref={(el) => {
                  if (el && item.name) cardRefsMap?.current?.set(item.name, el);
                }}
                onClick={() => item.type === "spot" && onCardClick?.(item)}
                className="relative rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div
                  className="absolute -left-[33px] top-6 w-4 h-4 rounded-full border-2 border-[#0066CC]"
                  style={{ background: "var(--bg-card)" }}
                />
                <div className="flex items-start gap-4">
                  <div className="text-sm font-bold min-w-[50px] mt-1 text-[#0066CC]">
                    {item.time}
                  </div>
                  <div className="flex-1">
                    {item.type === "meal" ? (
                      <RestaurantCard item={item} isDark={isDark} />
                    ) : (
                      <SpotCard
                        item={item}
                        isDark={isDark}
                        spotIndex={currentSpotIndex}
                        isFavorited={favoriteSet?.has(item.name)}
                        onToggleFavorite={onToggleFavorite}
                        onDetailOpen={onDetailOpen}
                        onSwap={
                          alternatives && alternatives[item.name]
                            ? () => onSwapRequest(dayIndex, idx, item)
                            : undefined
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {day.accommodationOptions && day.accommodationOptions.length > 0 && (
        <div className="mt-6 ml-5">
          <div className="flex items-center gap-2 mb-3">
            <Bed className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-bold text-purple-500">추천 숙소</h3>
            <span className="text-xs text-purple-400 ml-1">
              {day.accommodationOptions.length}곳 추천
            </span>
          </div>
          <div className="space-y-3">
            {day.accommodationOptions.map((accom, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
                style={{
                  background: isDark ? "rgba(147,51,234,0.08)" : "rgba(245,243,255,0.7)",
                  border: `1px solid ${isDark ? "rgba(147,51,234,0.2)" : "#E9D5FF"}`,
                }}
              >
                <AccommodationCard item={accom} isDark={isDark} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
