import { useEffect, useRef, useState, useMemo, forwardRef, useImperativeHandle, useCallback } from "react";
import { Map as MapIcon, Maximize2, Minimize2 } from "lucide-react";

const DAY_COLORS = ["#0066CC", "#00A86B", "#E85D04"];

const CATEGORY_COLORS = {
  "체험/액티비티": "#3B82F6",
  "맛집/미식": "#EF4444",
  "휴양/힐링": "#22C55E",
  "문화/역사": "#8B5CF6",
  "포토스팟/감성": "#EC4899",
  "자연/트레킹": "#059669",
};

const KakaoMap = forwardRef(function KakaoMap(
  { itinerary, activeDay = null, expanded, onToggleExpand, onMarkerClick },
  ref
) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const overlaysRef = useRef([]);
  const polylinesRef = useRef([]);
  const infoWindowRef = useRef(null);
  const markerNameMap = useRef(new Map());
  const [mapReady, setMapReady] = useState(false);
  const [error, setError] = useState(null);

  // 좌표 있는 장소만 메모이제이션 (Day 필터 적용)
  const allPlaces = useMemo(() => {
    const places = [];
    itinerary.forEach((day, dayIdx) => {
      if (activeDay !== null && dayIdx !== activeDay) return;
      day.schedule.forEach((item) => {
        if (item.latitude && item.longitude) {
          places.push({ ...item, dayIdx, orderNum: places.length + 1 });
        }
      });
    });
    return places;
  }, [itinerary, activeDay]);

  // 외부에서 호출 가능한 메서드
  useImperativeHandle(ref, () => ({
    focusMarker(spotName, lat, lng) {
      if (!mapInstance.current) return;
      const position = new window.kakao.maps.LatLng(lat, lng);
      mapInstance.current.panTo(position);
      mapInstance.current.setLevel(5);

      // InfoWindow 열기
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
      const place = allPlaces.find((p) => p.name === spotName);
      if (place) {
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
        infoWindow.open(mapInstance.current);
        infoWindowRef.current = infoWindow;
      }
    },
  }), [mapReady, allPlaces]);

  // 카카오맵 SDK 로드 & 초기화
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
    return () => { cancelled = true; };
  }, []);

  // 마커 & 폴리라인 표시
  useEffect(() => {
    if (!mapReady || !mapInstance.current || allPlaces.length === 0) return;

    const map = mapInstance.current;

    // 기존 제거
    overlaysRef.current.forEach((o) => o.setMap(null));
    overlaysRef.current = [];
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];
    markerNameMap.current.clear();
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
      infoWindowRef.current = null;
    }

    const bounds = new window.kakao.maps.LatLngBounds();
    let globalOrderNum = 0;

    const filteredItinerary = activeDay !== null
      ? [{ ...itinerary[activeDay], _dayIdx: activeDay }]
      : itinerary.map((d, i) => ({ ...d, _dayIdx: i }));

    filteredItinerary.forEach((day) => {
      const dayIdx = day._dayIdx;
      const dayColor = DAY_COLORS[dayIdx % DAY_COLORS.length];
      const dayPlaces = day.schedule.filter((p) => p.latitude && p.longitude);
      const linePath = [];

      dayPlaces.forEach((place) => {
        globalOrderNum++;
        const position = new window.kakao.maps.LatLng(place.latitude, place.longitude);
        bounds.extend(position);
        linePath.push(position);

        // 카테고리별 마커 색상
        const bgColor = place.type === "meal"
          ? (place.mealType === "카페" ? "#F97316" : "#EF4444")
          : (CATEGORY_COLORS[place.category] || dayColor);

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

        content.addEventListener("click", () => {
          // 외부 콜백 (타임라인 스크롤 연동)
          onMarkerClick?.(place.name);

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
        markerNameMap.current.set(place.name, { overlay, position });
      });

      // 점선 폴리라인
      if (linePath.length >= 2) {
        const polyline = new window.kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 4,
          strokeColor: dayColor,
          strokeOpacity: 0.6,
          strokeStyle: "shortdash",
        });
        polyline.setMap(map);
        polylinesRef.current.push(polyline);
      }
    });

    if (allPlaces.length > 0) {
      map.setBounds(bounds, 60, 60, 60, 60);
    }
  }, [mapReady, allPlaces, itinerary, activeDay, onMarkerClick]);

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
      <div className="w-full rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
        <div className="text-center mb-4">
          <MapIcon className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--text-muted)" }} />
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{error}</p>
        </div>
        {allPlaces.length > 0 && (
          <div className="space-y-1.5">
            {allPlaces.slice(0, 8).map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background: "rgba(0, 102, 204, 0.15)", color: "#0066CC" }}>
                  {i + 1}
                </span>
                <span>{p.name}</span>
              </div>
            ))}
            {allPlaces.length > 8 && (
              <p className="text-[10px] ml-7" style={{ color: "var(--text-muted)" }}>+{allPlaces.length - 8}곳 더</p>
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
      <button
        onClick={onToggleExpand}
        className="absolute top-3 right-3 z-10 backdrop-blur-sm rounded-xl p-2 shadow-md transition-colors"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}
        aria-label={expanded ? "지도 축소" : "지도 확대"}
      >
        {expanded ? (
          <Minimize2 className="w-4 h-4" />
        ) : (
          <Maximize2 className="w-4 h-4" />
        )}
      </button>
      {itinerary.length > 1 && (
        <div className="absolute bottom-3 left-3 z-10 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md flex gap-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
          {itinerary.map((day, i) => {
            const isActive = activeDay === null || activeDay === i;
            return (
              <div key={i} className={`flex items-center gap-1.5 ${isActive ? "" : "opacity-30"}`}>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: DAY_COLORS[i % DAY_COLORS.length] }}
                />
                <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{day.day}일차</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

export default KakaoMap;
