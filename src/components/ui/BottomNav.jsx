import { ChevronRight } from "lucide-react";

export default function BottomNav({ onNext, canNext, nextLabel = "다음" }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-6 py-4 z-50">
      <button
        onClick={onNext}
        disabled={!canNext}
        className={`w-full flex items-center justify-center gap-2 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform active:scale-95 ${
          canNext
            ? "bg-[#FF6B35] text-white hover:bg-[#e55a2b] shadow-lg shadow-orange-200"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {nextLabel}
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
