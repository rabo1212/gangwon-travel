import { useState } from "react";
import { Wallet, User, Users } from "lucide-react";

// "1만~2만원" → { min: 10000, max: 20000 }
// "8,000~13,000원" → { min: 8000, max: 13000 }
function parsePriceRange(str) {
  if (!str) return null;
  const cleaned = str.replace(/원/g, "").replace(/,/g, "").trim();
  const parts = cleaned.split("~").map((p) => p.trim());

  function parseOne(s) {
    if (s.includes("만")) {
      const num = parseFloat(s.replace("만", ""));
      return isNaN(num) ? 0 : num * 10000;
    }
    const val = parseInt(s, 10);
    return isNaN(val) ? 0 : val;
  }

  if (parts.length === 2) {
    return { min: parseOne(parts[0]), max: parseOne(parts[1]) };
  }
  if (parts.length === 1) {
    const val = parseOne(parts[0]);
    return { min: val, max: val };
  }
  return null;
}

function formatWon(num) {
  if (num >= 10000) {
    const man = Math.round(num / 1000) / 10;
    return `약 ${man}만원`;
  }
  return `약 ${num.toLocaleString()}원`;
}

export default function BudgetSummary({ itinerary, isDark }) {
  const [personCount, setPersonCount] = useState(1);

  let mealMin = 0,
    mealMax = 0,
    mealCount = 0;
  let cafeMin = 0,
    cafeMax = 0,
    cafeCount = 0;

  itinerary.forEach((day) => {
    day.schedule.forEach((item) => {
      if (item.type !== "meal") return;
      const isCafe = item.mealType === "카페" || item.category === "간식/카페";

      if (item.restaurants && item.restaurants.length > 0) {
        const price = parsePriceRange(item.restaurants[0].priceRange);
        if (price) {
          if (isCafe) {
            cafeMin += price.min;
            cafeMax += price.max;
            cafeCount++;
          } else {
            mealMin += price.min;
            mealMax += price.max;
            mealCount++;
          }
        }
      }
    });
  });

  const totalMin = (mealMin + cafeMin) * personCount;
  const totalMax = (mealMax + cafeMax) * personCount;

  if (mealCount + cafeCount === 0) return null;

  return (
    <div className="mt-8">
      <div
        className="rounded-2xl p-5 shadow-sm"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#00A86B]" />
            <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>예상 비용</h3>
          </div>
          {/* 인원 토글 */}
          <div className="flex items-center rounded-xl p-1" style={{ background: "var(--bg-input)" }}>
            <button
              onClick={() => setPersonCount(1)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                personCount === 1 ? "shadow-sm" : ""
              }`}
              style={
                personCount === 1
                  ? { background: "var(--bg-card)", color: "var(--text-primary)" }
                  : { color: "var(--text-muted)" }
              }
            >
              <User className="w-3 h-3" /> 1인
            </button>
            <button
              onClick={() => setPersonCount(2)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                personCount === 2 ? "shadow-sm" : ""
              }`}
              style={
                personCount === 2
                  ? { background: "var(--bg-card)", color: "var(--text-primary)" }
                  : { color: "var(--text-muted)" }
              }
            >
              <Users className="w-3 h-3" /> 2인
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {mealCount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "var(--text-secondary)" }}>
                🍽️ 식비 ({mealCount}끼)
              </span>
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>
                {formatWon(mealMin * personCount)} ~ {formatWon(mealMax * personCount)}
              </span>
            </div>
          )}
          {cafeCount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: "var(--text-secondary)" }}>
                ☕ 카페 ({cafeCount}회)
              </span>
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>
                {formatWon(cafeMin * personCount)} ~ {formatWon(cafeMax * personCount)}
              </span>
            </div>
          )}

          <div className="pt-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--border-color)" }}>
            <span className="font-bold" style={{ color: "var(--text-primary)" }}>
              합계 ({personCount}인 기준)
            </span>
            <span className="text-lg font-extrabold text-[#00A86B]">
              {formatWon(totalMin)} ~ {formatWon(totalMax)}
            </span>
          </div>
        </div>

        <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
          * 식비만 포함된 예상 금액입니다. 입장료/숙박비는 별도입니다.
        </p>
      </div>
    </div>
  );
}
