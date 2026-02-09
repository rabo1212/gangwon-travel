import { useEffect, useRef, useState } from "react";
import { Map as MapIcon, Maximize2, Minimize2 } from "lucide-react";

const MARKER_COLORS = {
  spot: "#0066CC",
  meal: "#E85D04",
};

const DAY_COLORS = ["#0066CC", "#00A86B", "#E85D04"];

export default function KakaoMap({ itinerary, expanded, onToggleExpand }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [error, setError] = useState(null);

  // 전체 장소 추출 (좌표 있는 것만)
  const allPlaces = [];
  itinerary.forEach((day, dayIdx) => {
    day.schedule.forEach((item, itemIdx) => {
      if (item.latitude && item.longitude) {
        allPlaces.push({ ...item, dayIdx, itemIdx, orderNum: allPlaces.length + 1 });
      }
    });
  });

  // 카카오맵 SDK 로드 & 초기화
  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      setError("카카오맵 SDK가 로드되지 않았습니다");
      return;
    }

    window.kakao.maps.load(() => {
      if (!mapRef.current) return;

      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(37.8, 128.5), // 강원도 중심
        level: 10,
      });

      mapInstance.current = map;
      setMapReady(true);
    });
  }, []);

  // 마커 & 폴리라인 표시
  useEffect(() => {
    if (!mapReady || !mapInstance.current || allPlaces.length === 0) return;

    const map = mapInstance.current;

    // 기존 오버레이 제거를 위해 새로 그리기
    const bounds = new window.kakao.maps.LatLngBounds();
    const markers = [];
    const overlays = [];

    // Day별로 마커 + 폴리라인
    itinerary.forEach((day, dayIdx) => {
      const dayColor = DAY_COLORS[dayIdx % DAY_COLORS.length];
      const dayPlaces = day.schedule.filter((p) => p.latitude && p.longitude);
      const linePath = [];

      dayPlaces.forEach((place, placeIdx) => {
        const position = new window.kakao.maps.LatLng(place.latitude, place.longitude);
        bounds.extend(position);
        linePath.push(position);

        // 번호 커스텀 오버레이
        const isSpot = place.type === "spot";
        const bgColor = isSpot ? dayColor : "#E85D04";
        const emoji = isSpot ? "🏔️" : "🍽️";

        const content = document.createElement("div");
        content.innerHTML = `
          <div style="
            position: relative;
            cursor: pointer;
          ">
            <div style="
              background: ${bgColor};
              color: white;
              border-radius: 20px;
              padding: 4px 10px;
              font-size: 11px;
              font-weight: 700;
              white-space: nowrap;
              box-shadow: 0 2px 8px rgba(0,0,0,0.25);
              border: 2px solid white;
              display: flex;
              align-items: center;
              gap: 3px;
            ">
              <span>${emoji}</span>
              <span>${place.name.length > 8 ? place.name.slice(0, 8) + "…" : place.name}</span>
            </div>
            <div style="
              position: absolute;
              bottom: -6px;
              left: 50%;
              transform: translateX(-50%);
              width: 0; height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-top: 6px solid ${bgColor};
            "></div>
          </div>
        `;

        const overlay = new window.kakao.maps.CustomOverlay({
          position,
          content,
          yAnchor: 1.4,
        });
        overlay.setMap(map);
        overlays.push(overlay);
      });

      // 폴리라인
      if (linePath.length >= 2) {
        const polyline = new window.kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 3,
          strokeColor: dayColor,
          strokeOpacity: 0.7,
          strokeStyle: "solid",
        });
        polyline.setMap(map);
      }
    });

    // 모든 마커가 보이도록 bounds 조정
    if (allPlaces.length > 0) {
      map.setBounds(bounds, 60, 60, 60, 60);
    }

    // 클린업
    return () => {
      overlays.forEach((o) => o.setMap(null));
    };
  }, [mapReady, allPlaces.length]);

  // expanded 변경 시 지도 리사이즈
  useEffect(() => {
    if (!mapInstance.current || !mapReady) return;
    setTimeout(() => {
      mapInstance.current.relayout();
      if (allPlaces.length > 0) {
        const bounds = new window.kakao.maps.LatLngBounds();
        allPlaces.forEach((p) => {
          bounds.extend(new window.kakao.maps.LatLng(p.latitude, p.longitude));
        });
        mapInstance.current.setBounds(bounds, 60, 60, 60, 60);
      }
    }, 300);
  }, [expanded]);

  if (error) {
    return (
      <div className="w-full h-[200px] bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center rounded-2xl">
        <div className="text-center">
          <MapIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className={`w-full rounded-2xl transition-all duration-300 ${
          expanded ? "h-[450px]" : "h-[250px]"
        }`}
      />
      {/* 확대/축소 버튼 */}
      <button
        onClick={onToggleExpand}
        className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-md border border-gray-200 hover:bg-white transition-colors"
        aria-label={expanded ? "지도 축소" : "지도 확대"}
      >
        {expanded ? (
          <Minimize2 className="w-4 h-4 text-gray-600" />
        ) : (
          <Maximize2 className="w-4 h-4 text-gray-600" />
        )}
      </button>
      {/* Day 범례 */}
      {itinerary.length > 1 && (
        <div className="absolute bottom-3 left-3 z-10 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border border-gray-200 flex gap-3">
          {itinerary.map((day, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: DAY_COLORS[i % DAY_COLORS.length] }}
              />
              <span className="text-xs font-medium text-gray-600">{day.day}일차</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
