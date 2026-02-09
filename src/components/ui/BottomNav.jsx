import { ChevronRight } from "lucide-react";

export default function BottomNav({ onNext, canNext, nextLabel = "다음", dark }) {
  return (
    <div className={`fixed bottom-0 left-0 right-0 backdrop-blur-sm px-6 py-4 z-50 ${
      dark
        ? "bg-[#0f0f1a]/95 border-t border-white/10"
        : "bg-white/95 border-t border-gray-200"
    }`}>
      <button
        onClick={onNext}
        disabled={!canNext}
        className={`w-full flex items-center justify-center gap-2 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform active:scale-95 ${
          canNext
            ? dark
              ? "bg-gradient-to-r from-[#00A86B] to-[#0066CC] text-white shadow-lg shadow-[#00A86B]/20"
              : "bg-[#FF6B35] text-white hover:bg-[#e55a2b] shadow-lg shadow-orange-200"
            : dark
              ? "bg-white/10 text-white/30 cursor-not-allowed"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {nextLabel}
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
