import { Database, ChevronRight } from "lucide-react";
import MountainBackground from "../ui/MountainBackground";

export default function WelcomeStep({ onNext }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-gradient-to-b from-[#0a0a1a] via-[#1A1A2E] to-[#0d2818]">
      <MountainBackground />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* 로고 */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#00A86B] to-[#0066CC] flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <Database className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#FF6B35] animate-pulse" />
        </div>

        {/* 타이틀 */}
        <p className="text-[#00A86B] text-sm font-bold tracking-[0.3em] mb-2">GANGWON 2026</p>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-1 tracking-tight">
          디비디비딥
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-[#00A86B] mb-4">
          DB-DEEP 강원
        </h2>
        <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#00A86B] to-transparent mb-6" />

        {/* 슬로건 */}
        <p className="text-white/60 text-lg font-medium mb-2 italic">
          "가볍게 누르고, 깊게 빠지다"
        </p>
        <p className="text-white/40 text-sm max-w-xs leading-relaxed mb-10">
          강원도는 대한민국 최대의 경험 데이터 광산.
          <br />
          당신만의 여행 데이터를 채굴하세요.
        </p>

        {/* CTA */}
        <button
          onClick={onNext}
          className="group flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#00A86B] to-[#0066CC] hover:from-[#00c07b] hover:to-[#0077ee] text-white text-xl font-bold rounded-2xl shadow-lg shadow-[#00A86B]/20 hover:shadow-xl hover:shadow-[#00A86B]/30 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          채굴 시작하기
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="mt-10 text-xs text-white/20">
          DATA MINER EXPERIENCE
        </p>
      </div>
    </div>
  );
}
