import { ChevronLeft } from "lucide-react";

export default function StepHeader({ title, subtitle, onBack }) {
  return (
    <div className="bg-white px-6 pt-8 pb-2">
      <button
        onClick={onBack}
        aria-label="이전 단계로 돌아가기"
        className="flex items-center gap-1 text-[#0066CC] font-medium text-sm mb-4 hover:underline active:opacity-70"
      >
        <ChevronLeft className="w-4 h-4" />
        이전
      </button>
      <h1 className="text-2xl md:text-3xl font-extrabold text-[#1A1A2E]">{title}</h1>
      {subtitle && (
        <p className="text-gray-500 mt-1 text-sm md:text-base">{subtitle}</p>
      )}
    </div>
  );
}
