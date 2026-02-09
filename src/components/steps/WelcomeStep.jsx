import { useState } from "react";
import { Database, ChevronRight, ClipboardList, Trash2 } from "lucide-react";
import MountainBackground from "../ui/MountainBackground";
import { getSavedTrips, deleteTrip } from "../../utils/tripStorage";

export default function WelcomeStep({ onNext, onLoadTrip }) {
  const [showSaved, setShowSaved] = useState(false);
  const [savedTrips, setSavedTrips] = useState([]);

  const handleShowSaved = () => {
    setSavedTrips(getSavedTrips());
    setShowSaved(true);
  };

  const handleDelete = (e, tripId) => {
    e.stopPropagation();
    deleteTrip(tripId);
    setSavedTrips(getSavedTrips());
  };

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
          강원도의 숨은 경험 데이터를 발견하고,
          <br />
          나만의 여행 루트를 완성하세요.
        </p>

        {/* CTA */}
        <button
          onClick={onNext}
          className="group flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#00A86B] to-[#0066CC] hover:from-[#00c07b] hover:to-[#0077ee] text-white text-xl font-bold rounded-2xl shadow-lg shadow-[#00A86B]/20 hover:shadow-xl hover:shadow-[#00A86B]/30 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          여행 시작하기
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* 저장된 일정 버튼 */}
        <button
          onClick={handleShowSaved}
          className="mt-4 flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white/60 hover:text-white/80 rounded-xl text-sm font-medium transition-all active:scale-95"
        >
          <ClipboardList className="w-4 h-4" />
          저장된 일정
        </button>

        <p className="mt-8 text-xs text-white/20">
          DEEP DIVE INTO GANGWON
        </p>
      </div>

      {/* 저장된 일정 모달 */}
      {showSaved && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center"
          onClick={() => setShowSaved(false)}
        >
          <div
            className="w-full max-w-lg bg-[#1A1A2E] rounded-t-3xl p-6 pb-10 max-h-[70vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#00A86B]" />
              저장된 일정
            </h3>

            {savedTrips.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/30 text-sm">아직 저장된 일정이 없어요</p>
                <p className="text-white/20 text-xs mt-1">여행을 만들고 저장해보세요!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedTrips.map((trip) => (
                  <div
                    key={trip.id}
                    onClick={() => {
                      onLoadTrip(trip);
                      setShowSaved(false);
                    }}
                    className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer active:scale-[0.98]"
                  >
                    <div className="text-2xl">{trip.zone.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-bold text-sm truncate">
                        {trip.zone.name}
                      </div>
                      <div className="text-white/40 text-xs mt-0.5">
                        {trip.duration} · {trip.travelMode} · 스팟 {trip.spotCount || "?"}곳
                      </div>
                      <div className="text-white/25 text-[10px] mt-0.5">
                        {new Date(trip.savedAt).toLocaleDateString("ko", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, trip.id)}
                      className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
