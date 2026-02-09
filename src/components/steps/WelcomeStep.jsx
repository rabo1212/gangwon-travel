import { Mountain, Sparkles, Play } from "lucide-react";
import MountainBackground from "../ui/MountainBackground";

export default function WelcomeStep({ onNext }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-green-50/30">
      <MountainBackground />
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="mb-6 relative">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#0066CC] to-[#00A86B] flex items-center justify-center shadow-xl">
            <Mountain className="w-14 h-14 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center animate-bounce">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1A1A2E] mb-3 tracking-tight">강원도</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-[#0066CC] mb-2">여행 루트 추천</h2>
        <p className="text-gray-500 text-lg mb-2 font-medium">Gangwon-do Travel Route</p>
        <div className="w-16 h-1 bg-gradient-to-r from-[#0066CC] to-[#00A86B] rounded-full mb-6" />
        <p className="text-gray-600 text-base md:text-lg max-w-md leading-relaxed mb-10">
          나만의 맞춤 강원도 여행 코스를<br />간편하게 추천받아 보세요
        </p>

        <button
          onClick={onNext}
          className="group flex items-center gap-3 px-10 py-5 bg-[#FF6B35] hover:bg-[#e55a2b] text-white text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          <Play className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          시작하기
        </button>
        <p className="mt-8 text-sm text-gray-400">터치하여 여행을 시작하세요</p>
      </div>
    </div>
  );
}
