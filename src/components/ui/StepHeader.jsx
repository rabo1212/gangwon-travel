import { ChevronLeft } from "lucide-react";

export default function StepHeader({ title, subtitle, onBack, dark }) {
  return (
    <div className={`px-6 pt-8 pb-2 ${dark ? "bg-transparent" : "bg-white"}`}>
      <button
        onClick={onBack}
        aria-label="이전 단계로 돌아가기"
        className={`flex items-center gap-1 font-medium text-sm mb-4 hover:underline active:opacity-70 ${
          dark ? "text-[#00A86B]" : "text-[#0066CC]"
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        이전
      </button>
      <h1 className={`text-2xl md:text-3xl font-extrabold ${dark ? "text-white" : "text-[#1A1A2E]"}`}>
        {title}
      </h1>
      {subtitle && (
        <p className={`mt-1 text-sm md:text-base ${dark ? "text-white/50" : "text-gray-500"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
