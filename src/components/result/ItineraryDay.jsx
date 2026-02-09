import { Bed } from "lucide-react";
import SpotCard from "./SpotCard";
import RestaurantCard from "./RestaurantCard";
import AccommodationCard from "./AccommodationCard";

export default function ItineraryDay({ day }) {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#0066CC] text-white flex items-center justify-center font-bold text-lg">
          {day.day}
        </div>
        <h2 className="text-xl font-bold text-[#1A1A2E]">{day.title}</h2>
      </div>

      <div className="space-y-3 ml-5 border-l-2 border-blue-100 pl-6">
        {day.schedule.map((item, idx) => (
          <div
            key={idx}
            className="relative rounded-2xl p-5 shadow-sm border bg-white border-gray-100 hover:shadow-md transition-shadow duration-200"
          >
            <div className="absolute -left-[33px] top-6 w-4 h-4 rounded-full border-2 bg-white border-[#0066CC]" />
            <div className="flex items-start gap-4">
              <div className="text-sm font-bold min-w-[50px] mt-1 text-[#0066CC]">
                {item.time}
              </div>
              <div className="flex-1">
                {item.type === "meal" ? (
                  <RestaurantCard item={item} />
                ) : (
                  <SpotCard item={item} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 추천 숙소 섹션 (2~3개) */}
      {day.accommodationOptions && day.accommodationOptions.length > 0 && (
        <div className="mt-6 ml-5">
          <div className="flex items-center gap-2 mb-3">
            <Bed className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-purple-700">추천 숙소</h3>
            <span className="text-xs text-purple-400 ml-1">
              {day.accommodationOptions.length}곳 추천
            </span>
          </div>
          <div className="space-y-3">
            {day.accommodationOptions.map((accom, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-5 shadow-sm border bg-purple-50/50 border-purple-200 hover:shadow-md transition-shadow duration-200"
              >
                <AccommodationCard item={accom} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
