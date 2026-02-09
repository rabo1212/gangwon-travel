import { useEffect, useRef, useState, useMemo } from "react";
import { Map as MapIcon, Maximize2, Minimize2 } from "lucide-react";

const DAY_COLORS = ["#0066CC", "#00A86B", "#E85D04"];

export default function KakaoMap({ itinerary, expanded, onToggleExpand }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const overlaysRef = useRef([]);
  const polylinesRef = useRef([]);
  const infoWindowRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [error, setError] = useState(null);

  // 좌표 있는 장소만 메모이제이션
  const allPlaces = useMemo(() => {
    const places = [];
    itinerary.forEach((day, dayIdx) => {
      day.schedule.forEach((item) => {
        if (item.latitude && item.longitude) {
          places.push({ ...item, dayIdx, orderNum: places.length + 1 });
        }
      });
    });
    return places;
  }, [itinerary]);

  // 카카오맵 SDK 로드 & 초기화 (재시도 포함)
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 10;
    let cancelled = false;

    function tryInitMap() {
      if (cancelled) return;

      if (!window.kakao || !window.kakao.maps) {
        retryCount++;
        if (retryCount >= maxRetries) {
          setError("카카오맵 SDK가 로드되지 않았습니다");
          return;
        }
        setTimeout(tryInitMap, 500);
        return;
      }

      window.kakao.maps.load(() => {
        if (cancelled || !mapRef.current) return;

        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(37.8, 128.5),
          level: 10,
        });

        mapInstance.current = map;
        setMapReady(true);
      });
    }

    tryInitMap();

    return () => {
      cancelled = true;
    };
  }, []);

  // 마커 & 폴리라인 표시
  useEffect(() => {
    if (!mapReady || !mapInstance.current || allPlaces.length === 0) return;

    const map = mapInstance.current;

    // 기존 오버레이 제거
    overlaysRef.current.forEach((o) => o.setMap(null));
    overlaysRef.current = [];
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
      infoWindowRef.current = null;
    }

    const bounds = new window.kakao.maps.LatLngBounds();
    let globalOrderNum = 0;

    // Day별로 마커 + 폴리라인
    itinerary.forEach((day, dayIdx) => {
      const dayColor = DAY_COLORS[dayIdx % DAY_COLORS.length];
      const dayPlaces = day.schedule.filter((p) => p.latitude && p.longitude);
      const linePath = [];

      dayPlaces.forEach((place) => {
        globalOrderNum++;
        const position = new window.kakao.maps.LatLng(place.latitude, place.longitude);
        bounds.extend(position);
        linePath.push(position);

        const isSpot = place.type === "spot";
        const bgColor = isSpot ? dayColor : "#E85D04";

        const content = document.createElement("div");
        content.innerHTML = `
          <div style="position: relative; cursor: pointer;">
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
              gap: 4px;
            ">
              <span style="
                background: white;
                color: ${bgColor};
                width: 18px;
                height: 18px;
                border-radius: 50%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                font-weight: 800;
                flex-shrink: 0;
              ">${globalOrderNum}</span>
              <span>${place.name.length > 6 ? place.name.slice(0, 6) + "…" : place.name}</span>
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

        // 클릭 시 InfoWindow 표시
        content.addEventListener("click", () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }
          const infoContent = `
            <div style="padding: 12px 16px; max-width: 220px; font-size: 13px; line-height: 1.5;">
              <strong style="font-size: 14px;">${place.name}</strong>
              ${place.description ? `<p style="margin: 4px 0 0; color: #666; font-size: 11px;">${place.description.length > 40 ? place.description.slice(0, 40) + "…" : place.description}</p>` : ""}
              ${place.address ? `<p style="margin: 4px 0 0; color: #888; font-size: 10px;">📍 ${place.address.length > 30 ? place.address.slice(0, 30) + "…" : place.address}</p>` : ""}
              ${place.hours ? `<p style="margin: 2px 0 0; color: #0066CC; font-size: 10px;">🕐 ${place.hours}</p>` : ""}
            </div>
          `;
          const infoWindow = new window.kakao.maps.InfoWindow({
            content: infoContent,
            position,
          });
          infoWindow.open(map);
          infoWindowRef.current = infoWindow;
        });

        const overlay = new window.kakao.maps.CustomOverlay({
          position,
          content,
          yAnchor: 1.4,
        });
        overlay.setMap(map);
        overlaysRef.current.push(overlay);
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
        polylinesRef.current.push(polyline);
      }
    });

    // 모든 마커가 보이도록 bounds 조정
    if (allPlaces.length > 0) {
      map.setBounds(bounds, 60, 60, 60, 60);
    }
  }, [mapReady, allPlaces, itinerary]);

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
  }, [expanded, mapReady, allPlaces]);

  if (error) {
    return (
      <div className="w-full bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-5">
        <div className="text-center mb-4">
          <MapIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">{error}</p>
        </div>
        {allPlaces.length > 0 && (
          <div className="space-y-1.5">
            {allPlaces.slice(0, 8).map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-600 flex-shrink-0">
                  {i + 1}
                </span>
                <span>{p.name}</span>
              </div>
            ))}
            {allPlaces.length > 8 && (
              <p className="text-[10px] text-gray-300 ml-7">+{allPlaces.length - 8}곳 더</p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className={`w-full rounded-2xl transition-all duration-300 ${
          expanded ? "h-[450px]" : "h-[300px]"
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
