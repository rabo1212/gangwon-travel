export default function DayTabs({ days, activeDay, onSelectDay }) {
  if (!days || days.length <= 1) return null;

  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
      <button
        onClick={() => onSelectDay(null)}
        className={`shrink-0 px-5 min-h-[44px] rounded-full text-sm font-bold transition-all active:scale-95 ${
          activeDay === null
            ? "bg-[#0066CC] text-white shadow-md"
            : ""
        }`}
        style={activeDay !== null ? { background: "var(--bg-input)", color: "var(--text-secondary)" } : undefined}
      >
        전체
      </button>
      {days.map((_, idx) => (
        <button
          key={idx}
          onClick={() => onSelectDay(idx)}
          className={`shrink-0 px-5 min-h-[44px] rounded-full text-sm font-bold transition-all active:scale-95 ${
            activeDay === idx
              ? "bg-[#0066CC] text-white shadow-md"
              : ""
          }`}
          style={activeDay !== idx ? { background: "var(--bg-input)", color: "var(--text-secondary)" } : undefined}
        >
          Day {idx + 1}
        </button>
      ))}
    </div>
  );
}
