import { ChevronLeft } from "lucide-react";

export default function StepHeader({ title, subtitle, onBack }) {
  return (
    <div className="px-6 pt-8 pb-2" style={{ background: "transparent" }}>
      <button
        onClick={onBack}
        aria-label="이전 단계로 돌아가기"
        className="flex items-center gap-1 font-medium text-sm mb-4 text-[#00A86B] hover:underline active:opacity-70"
      >
        <ChevronLeft className="w-4 h-4" />
        이전
      </button>
      <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-sm md:text-base" style={{ color: "var(--text-muted)" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
