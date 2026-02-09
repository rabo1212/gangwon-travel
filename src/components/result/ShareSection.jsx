import { useState, useRef } from "react";
import { Copy, Share2, Check, Download, Image } from "lucide-react";
import html2canvas from "html2canvas";

function buildItineraryText(route, selectedRegions, duration, travelMode) {
  let text = `🏔️ 강원도 여행 루트\n`;
  text += `📍 ${selectedRegions.join(" → ")} | ${duration} | ${travelMode}\n`;

  route.itinerary.forEach((day) => {
    text += `\n📅 ${day.title}\n`;
    day.schedule.forEach((item) => {
      if (item.type === "spot") {
        text += `  ${item.time} 🏔️ ${item.name}\n`;
      } else if (item.type === "meal") {
        const icon = item.mealType === "점심" ? "🍽️" : item.mealType === "카페" ? "☕" : "🍷";
        text += `  ${item.time} ${icon} [${item.mealType}] ${item.name}\n`;
        if (item.restaurants && item.restaurants.length > 0) {
          item.restaurants.forEach((r) => {
            text += `    → ${r.name} (${r.priceRange || ""})\n`;
          });
        }
      }
    });
    if (day.accommodationOptions && day.accommodationOptions.length > 0) {
      text += `  🏨 추천 숙소\n`;
      day.accommodationOptions.forEach((a) => {
        text += `    - ${a.name} (${a.type}) ${a.priceRange}\n`;
      });
    }
  });

  return text;
}

// 이미지용 여행 카드 (숨겨진 상태로 렌더링 → 캡처)
function ItineraryCard({ route, selectedRegions, duration, travelMode }) {
  return (
    <div style={{
      width: 400, padding: 32, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: "linear-gradient(135deg, #0066CC 0%, #00A86B 100%)", color: "#fff",
      borderRadius: 24,
    }}>
      {/* 헤더 */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 4 }}>🏔️ 강원도 여행 루트</div>
        <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.3 }}>
          {selectedRegions.join(" → ")}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 10 }}>
          <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: 20, fontSize: 12 }}>
            {travelMode === "자차" ? "🚗" : "🚌"} {travelMode}
          </span>
          <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: 20, fontSize: 12 }}>
            📅 {duration}
          </span>
        </div>
      </div>

      {/* 일정 */}
      {route.itinerary.map((day, dayIdx) => (
        <div key={dayIdx} style={{
          background: "#fff", borderRadius: 16, padding: 20, marginBottom: 12, color: "#1A1A2E",
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: "#0066CC" }}>
            {day.title}
          </div>
          {day.schedule.map((item, idx) => (
            <div key={idx} style={{
              display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start",
            }}>
              <span style={{
                fontSize: 11, fontWeight: 700, color: item.type === "meal" ? "#E85D04" : "#0066CC",
                minWidth: 40, paddingTop: 2,
              }}>
                {item.time}
              </span>
              <div style={{ flex: 1 }}>
                {item.type === "meal" ? (
                  <>
                    <span style={{
                      display: "inline-block", fontSize: 10, fontWeight: 600,
                      background: item.mealType === "점심" ? "#FFF3E0" : "#FCE4EC",
                      color: item.mealType === "점심" ? "#E65100" : "#C62828",
                      padding: "1px 6px", borderRadius: 6, marginBottom: 2,
                    }}>
                      {item.mealType}
                    </span>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</div>
                    {item.restaurants && item.restaurants.length > 0 && (
                      <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>
                        추천: {item.restaurants.map((r) => r.name).join(", ")}
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ fontSize: 13, fontWeight: 600 }}>🏔️ {item.name}</div>
                )}
              </div>
            </div>
          ))}

          {day.accommodationOptions && day.accommodationOptions.length > 0 && (
            <div style={{
              marginTop: 10, paddingTop: 10, borderTop: "1px dashed #E0E0E0",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#7B1FA2", marginBottom: 6 }}>
                🏨 추천 숙소
              </div>
              {day.accommodationOptions.map((a, i) => (
                <div key={i} style={{ fontSize: 11, color: "#555", marginBottom: 3 }}>
                  • {a.name} ({a.type}) — {a.priceRange}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* 푸터 */}
      <div style={{ textAlign: "center", fontSize: 10, opacity: 0.6, marginTop: 8 }}>
        강원도 여행 루트 추천 앱으로 생성됨
      </div>
    </div>
  );
}

export default function ShareSection({ route, selectedRegions, duration, travelMode }) {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const cardRef = useRef(null);

  const shareText = route
    ? buildItineraryText(route, selectedRegions, duration, travelMode)
    : `강원도 여행: ${selectedRegions.join(", ")} (${duration})`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveImage = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    setSaveError(null);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `강원도여행_${selectedRegions.join("_")}_${duration}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("이미지 저장 실패:", err);
      setSaveError("이미지 저장에 실패했어요. 다시 시도해주세요.");
      setTimeout(() => setSaveError(null), 3000);
    }
    setSaving(false);
  };

  const handleShareImage = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });
      canvas.toBlob(async (blob) => {
        if (blob && navigator.share) {
          const file = new File([blob], "강원도여행루트.png", { type: "image/png" });
          try {
            await navigator.share({ title: "강원도 여행 루트", files: [file] });
          } catch { /* user cancelled */ }
        } else {
          // fallback: 다운로드
          const link = document.createElement("a");
          link.download = `강원도여행_${selectedRegions.join("_")}_${duration}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        }
        setSaving(false);
      }, "image/png");
      return;
    } catch (err) {
      console.error("공유 실패:", err);
      setSaveError("공유에 실패했어요. 이미지 저장을 이용해주세요.");
      setTimeout(() => setSaveError(null), 3000);
    }
    setSaving(false);
  };

  return (
    <div className="mt-8 mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-[#1A1A2E] mb-2 text-center">이 여행 루트 공유하기</h3>
        <p className="text-sm text-gray-500 mb-5 text-center">예쁜 카드 이미지로 저장하거나 카톡으로 공유해보세요</p>

        {/* 이미지 카드 미리보기 */}
        <div className="flex justify-center mb-5 overflow-x-auto">
          <div ref={cardRef} className="shrink-0">
            {route && (
              <ItineraryCard
                route={route}
                selectedRegions={selectedRegions}
                duration={duration}
                travelMode={travelMode}
              />
            )}
          </div>
        </div>

        {/* 에러 메시지 */}
        {saveError && (
          <div className="mb-3 p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center">
            {saveError}
          </div>
        )}

        {/* 버튼 3개 */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <button
              onClick={handleSaveImage}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-4 bg-[#0066CC] text-white rounded-2xl font-bold text-base hover:bg-[#0055aa] transition-colors active:scale-95 transform disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              {saving ? "저장 중..." : "이미지 저장"}
            </button>
            <button
              onClick={handleShareImage}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-4 bg-[#FEE500] text-[#3C1E1E] rounded-2xl font-bold text-base hover:bg-[#FDD800] transition-colors active:scale-95 transform disabled:opacity-50"
            >
              <Image className="w-5 h-5" />
              {saving ? "준비 중..." : "이미지 공유"}
            </button>
          </div>
          <button
            onClick={handleCopy}
            className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 transform ${
              copied
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "복사 완료!" : "텍스트로 복사"}
          </button>
        </div>
      </div>
    </div>
  );
}
