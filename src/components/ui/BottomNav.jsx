import { ChevronRight } from "lucide-react";

export default function BottomNav({ onNext, canNext, nextLabel = "다음" }) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 backdrop-blur-sm px-6 py-4 z-50"
      style={{
        background: "color-mix(in srgb, var(--bg-secondary) 95%, transparent)",
        borderTop: "1px solid var(--border-color)",
      }}
    >
      <button
        onClick={onNext}
        disabled={!canNext}
        className={`w-full flex items-center justify-center gap-2 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform active:scale-95 ${
          canNext
            ? "bg-gradient-to-r from-[#00A86B] to-[#0066CC] text-white shadow-lg shadow-[#00A86B]/20"
            : "cursor-not-allowed"
        }`}
        style={
          !canNext
            ? { background: "var(--bg-input)", color: "var(--text-muted)" }
            : undefined
        }
      >
        {nextLabel}
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
