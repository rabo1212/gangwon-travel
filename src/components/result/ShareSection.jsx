import { useState, useRef } from "react";
import { Copy, Check, Download, Image, Database } from "lucide-react";
import { TRAVEL_STYLES } from "../../data/constants";
import html2canvas from "html2canvas";

function buildItineraryText(route, zone, vibes, duration, travelMode) {
  let text = `DB-DEEP 강원 | 데이터 영수증\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `🗺️ Zone: ${zone?.emoji} ${zone?.name} (${zone?.nameKo})\n`;
  text += `🎯 Vibe: ${vibes.map((v) => {
    const s = TRAVEL_STYLES.find((t) => t.id === v);
    return `${s?.emoji}${s?.label}`;
  }).join(" ")}\n`;
  text += `📅 ${duration} | ${travelMode === "자차" ? "🚗" : "🚌"} ${travelMode}\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━\n`;

  route.itinerary.forEach((day) => {
    text += `\n📅 ${day.title}\n`;
    text += `- - - - - - - - - - - - - - -\n`;
    day.schedule.forEach((item) => {
      if (item.type === "spot") {
        text += `  ${item.time}  ${item.emoji} ${item.name}\n`;
      } else if (item.type === "meal") {
        const icon = item.mealType === "점심" ? "🍽️" : item.mealType === "카페" ? "☕" : "🍷";
        text += `  ${item.time}  ${icon} [${item.mealType}] ${item.name}\n`;
        if (item.restaurants && item.restaurants.length > 0) {
          item.restaurants.forEach((r) => {
            text += `           → ${r.name} (${r.priceRange || ""})\n`;
          });
        }
      }
    });
    if (day.accommodationOptions && day.accommodationOptions.length > 0) {
      text += `  🏨 추천 숙소\n`;
      day.accommodationOptions.forEach((a) => {
        text += `     - ${a.name} (${a.type}) ${a.priceRange}\n`;
      });
    }
  });

  text += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `DB-DEEP 강원에서 발급됨\n`;
  text += `가볍게 누르고, 깊게 빠지다.`;
  return text;
}

// 데이터 영수증 스타일 이미지 카드 (항상 밝은 테마 - 이미지 내보내기용)
function ReceiptCard({ route, zone, vibes, duration, travelMode }) {
  const totalSpots = route.itinerary.reduce(
    (sum, day) => sum + day.schedule.filter((s) => s.type === "spot").length,
    0
  );

  return (
    <div style={{
      width: 400, fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
      background: "#FFFFFF", borderRadius: 24, overflow: "hidden",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    }}>
      {/* 상단 딥네이비 바 */}
      <div style={{
        background: "linear-gradient(135deg, #1A1A2E 0%, #0d2818 100%)",
        padding: "24px 28px 20px", color: "#fff",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, opacity: 0.6, marginBottom: 8 }}>
          <span>⛏️</span> DB-DEEP 강원
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>나의 강원 데이터</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          <span style={{
            background: "rgba(0,168,107,0.2)", border: "1px solid rgba(0,168,107,0.3)",
            padding: "3px 10px", borderRadius: 20, fontSize: 11,
          }}>
            {zone?.emoji} {zone?.name}
          </span>
          {vibes.map((v) => {
            const s = TRAVEL_STYLES.find((t) => t.id === v);
            return (
              <span key={v} style={{
                background: "rgba(255,255,255,0.1)", padding: "3px 8px",
                borderRadius: 20, fontSize: 10,
              }}>
                {s?.emoji} {s?.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* 점선 구분 */}
      <div style={{
        borderTop: "2px dashed #E0E0E0", margin: "0 20px",
      }} />

      {/* 요약 정보 */}
      <div style={{
        display: "flex", justifyContent: "space-around", padding: "14px 20px",
        borderBottom: "1px solid #F0F0F0",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#999", marginBottom: 2 }}>기간</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A2E" }}>{duration}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#999", marginBottom: 2 }}>이동</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A2E" }}>{travelMode}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#999", marginBottom: 2 }}>스팟</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A2E" }}>{totalSpots}곳</div>
        </div>
      </div>

      {/* 일정 */}
      <div style={{ padding: "16px 24px" }}>
        {route.itinerary.map((day, dayIdx) => (
          <div key={dayIdx} style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: "#0066CC",
              marginBottom: 10, paddingBottom: 6,
              borderBottom: "1px dashed #E8E8E8",
            }}>
              {day.title}
            </div>
            {day.schedule.map((item, idx) => (
              <div key={idx} style={{
                display: "flex", gap: 10, marginBottom: 6, alignItems: "flex-start",
              }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, fontFamily: "'SF Mono', monospace",
                  color: item.type === "meal" ? "#E85D04" : "#0066CC",
                  minWidth: 42, paddingTop: 1,
                }}>
                  {item.time}
                </span>
                <div style={{ flex: 1 }}>
                  {item.type === "meal" ? (
                    <>
                      <span style={{
                        display: "inline-block", fontSize: 9, fontWeight: 600,
                        background: item.mealType === "카페" ? "#FCE4EC" : "#FFF3E0",
                        color: item.mealType === "카페" ? "#C62828" : "#E65100",
                        padding: "1px 5px", borderRadius: 4, marginBottom: 2,
                      }}>
                        {item.mealType}
                      </span>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{item.emoji} {item.name}</div>
                      {item.restaurants && item.restaurants.length > 0 && (
                        <div style={{ fontSize: 9, color: "#999", marginTop: 1 }}>
                          추천: {item.restaurants.map((r) => r.name).join(", ")}
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{item.emoji} {item.name}</div>
                  )}
                </div>
              </div>
            ))}

            {day.accommodationOptions && day.accommodationOptions.length > 0 && (
              <div style={{
                marginTop: 8, paddingTop: 8, borderTop: "1px dashed #E8E8E8",
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#7B1FA2", marginBottom: 4 }}>
                  🏨 추천 숙소
                </div>
                {day.accommodationOptions.map((a, i) => (
                  <div key={i} style={{ fontSize: 10, color: "#777", marginBottom: 2 }}>
                    · {a.name} ({a.type}) — {a.priceRange}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 점선 구분 */}
      <div style={{ borderTop: "2px dashed #E0E0E0", margin: "0 20px" }} />

      {/* 푸터 워터마크 */}
      <div style={{
        textAlign: "center", padding: "16px 20px 20px",
        fontSize: 10, color: "#BBBBBB", letterSpacing: 0.5,
      }}>
        DB-DEEP 강원에서 발급됨<br />
        <span style={{ fontSize: 9, fontStyle: "italic" }}>가볍게 누르고, 깊게 빠지다.</span>
      </div>
    </div>
  );
}

export default function ShareSection({ route, zone, vibes, duration, travelMode }) {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const cardRef = useRef(null);

  const shareText = route
    ? buildItineraryText(route, zone, vibes, duration, travelMode)
    : "";

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

  const zoneName = zone?.name || "강원";
  const fileName = `DBDEEP_${zoneName}_${duration}`;

  const handleSaveImage = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    setSaveError(null);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, backgroundColor: null, useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `${fileName}.png`;
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
        scale: 2, backgroundColor: null, useCORS: true,
      });
      canvas.toBlob(async (blob) => {
        if (blob && navigator.share) {
          const file = new File([blob], `${fileName}.png`, { type: "image/png" });
          try {
            await navigator.share({ title: "DB-DEEP 강원 데이터 영수증", files: [file] });
          } catch { /* user cancelled */ }
        } else {
          const link = document.createElement("a");
          link.download = `${fileName}.png`;
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
      <div
        className="rounded-2xl p-6 shadow-sm"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <Database className="w-4 h-4 text-[#00A86B]" />
          <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>데이터 영수증</h3>
        </div>
        <p className="text-sm mb-5 text-center" style={{ color: "var(--text-secondary)" }}>나만의 여행 데이터를 저장하고 공유하세요</p>

        {/* 영수증 카드 미리보기 */}
        <div className="flex justify-center mb-5 overflow-x-auto">
          <div ref={cardRef} className="shrink-0">
            {route && (
              <ReceiptCard
                route={route}
                zone={zone}
                vibes={vibes}
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

        {/* 버튼 */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <button
              onClick={handleSaveImage}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-4 bg-[#1A1A2E] text-white rounded-2xl font-bold text-base hover:bg-[#2a2a3e] transition-colors active:scale-95 transform disabled:opacity-50"
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
              copied ? "bg-[#00A86B] text-white" : ""
            }`}
            style={!copied ? { background: "var(--bg-input)", color: "var(--text-secondary)" } : undefined}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "복사 완료!" : "텍스트로 복사"}
          </button>
        </div>
      </div>
    </div>
  );
}
