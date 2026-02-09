export default function TravelSegment({ distanceKm, timeMinutes, travelMode, isDark }) {
  if (!distanceKm || !timeMinutes) return null;

  const icon = travelMode === "자차" ? "🚗" : "🚌";
  const modeLabel = travelMode === "자차" ? "자차" : "대중교통";
  const displayDist =
    distanceKm < 1
      ? `${Math.round(distanceKm * 1000)}m`
      : `${distanceKm.toFixed(1)}km`;
  const displayTime =
    timeMinutes < 1 ? "1분 미만" : `${Math.round(timeMinutes)}분`;

  return (
    <div className="flex items-center py-1.5 ml-2">
      <div
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
        style={{
          background: "var(--bg-input)",
          border: "1px solid var(--border-color)",
          color: "var(--text-muted)",
        }}
      >
        <span>{icon}</span>
        <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
          {modeLabel} {displayTime}
        </span>
        <span style={{ color: "var(--text-muted)" }}>·</span>
        <span>{displayDist}</span>
      </div>
    </div>
  );
}
