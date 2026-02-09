import { haversineDistance, estimatedTravelTime } from "./distance";
import { ALL_ACCOMMODATIONS } from "../data/accommodations";
import { REGIONS } from "../data/regions";

// ─── 시간 유틸 ───
function formatTime(totalMinutes) {
  const rounded = Math.ceil(totalMinutes / 5) * 5;
  const h = Math.floor(rounded / 60);
  const m = rounded % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function parseDurationMin(duration) {
  if (!duration) return 60;
  if (duration.includes("반나절")) return 180;
  if (duration.includes("2~3")) return 135;
  if (duration.includes("1~2")) return 75;
  if (duration.includes("30분~1")) return 45;
  if (duration.includes("30분")) return 30;
  return 60;
}

function getDayCount(duration) {
  if (duration === "당일치기") return 1;
  if (duration === "1박2일") return 2;
  return 3;
}

// ─── Nearest Neighbor 경로 최적화 ───
// 좌표가 있는 장소들을 가장 가까운 순서로 정렬
function nearestNeighborOrder(places) {
  if (places.length <= 1) return [...places];

  const remaining = [...places];
  const ordered = [remaining.shift()];

  while (remaining.length > 0) {
    const last = ordered[ordered.length - 1];
    let nearestIdx = 0;
    let nearestDist = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const dist = haversineDistance(
        last.latitude, last.longitude,
        remaining[i].latitude, remaining[i].longitude
      );
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    }

    ordered.push(remaining.splice(nearestIdx, 1)[0]);
  }

  return ordered;
}

// ─── K-Means 클러스터링 (다일 여행) ───
// 장소들을 k개 그룹으로 나눔 (지리적 근접성 기반)
function kMeansClusters(places, k) {
  if (places.length <= k) {
    return places.map((p) => [p]);
  }

  // 초기 중심: 장소 중 가장 먼 k개 선택
  const centers = [places[0]];
  while (centers.length < k) {
    let maxDist = -1;
    let farthest = null;
    for (const p of places) {
      if (centers.some((c) => c.name === p.name)) continue;
      const minCenterDist = Math.min(
        ...centers.map((c) =>
          haversineDistance(p.latitude, p.longitude, c.latitude, c.longitude)
        )
      );
      if (minCenterDist > maxDist) {
        maxDist = minCenterDist;
        farthest = p;
      }
    }
    if (farthest) centers.push(farthest);
  }

  let clusters = Array.from({ length: k }, () => []);

  // 10회 반복
  for (let iter = 0; iter < 10; iter++) {
    clusters = Array.from({ length: k }, () => []);

    // 각 장소를 가장 가까운 중심에 배정
    for (const p of places) {
      let minDist = Infinity;
      let bestCluster = 0;
      for (let c = 0; c < centers.length; c++) {
        const dist = haversineDistance(
          p.latitude, p.longitude,
          centers[c].latitude, centers[c].longitude
        );
        if (dist < minDist) {
          minDist = dist;
          bestCluster = c;
        }
      }
      clusters[bestCluster].push(p);
    }

    // 중심 재계산
    for (let c = 0; c < k; c++) {
      if (clusters[c].length === 0) continue;
      const avgLat = clusters[c].reduce((sum, p) => sum + p.latitude, 0) / clusters[c].length;
      const avgLon = clusters[c].reduce((sum, p) => sum + p.longitude, 0) / clusters[c].length;
      centers[c] = { latitude: avgLat, longitude: avgLon };
    }
  }

  // 빈 클러스터 제거
  return clusters.filter((c) => c.length > 0);
}

// ─── 클러스터를 지리적 순서로 정렬 (서→동, 남→북) ───
function sortClustersByLocation(clusters) {
  return clusters.sort((a, b) => {
    const aCenter = {
      lat: a.reduce((s, p) => s + p.latitude, 0) / a.length,
      lon: a.reduce((s, p) => s + p.longitude, 0) / a.length,
    };
    const bCenter = {
      lat: b.reduce((s, p) => s + p.latitude, 0) / b.length,
      lon: b.reduce((s, p) => s + p.longitude, 0) / b.length,
    };
    // 경도 기준 (서→동)
    return aCenter.lon - bCenter.lon;
  });
}

// ─── 하루 일정 빌드 ───
function buildDaySchedule(spots, restaurants, dayIndex, totalDays, travelMode) {
  const schedule = [];
  let clock = 9 * 60 + 30; // 09:30 시작

  // 스팟과 맛집을 합쳐서 Nearest Neighbor로 정렬
  const allPlaces = [
    ...spots.map((s) => ({ ...s, placeType: "spot" })),
    ...restaurants.map((r) => ({ ...r, placeType: "meal" })),
  ];

  // 좌표 있는 것만 Nearest Neighbor, 없는 것은 뒤에 붙임
  const withCoords = allPlaces.filter((p) => p.latitude && p.longitude);
  const withoutCoords = allPlaces.filter((p) => !p.latitude || !p.longitude);
  const ordered = [...nearestNeighborOrder(withCoords), ...withoutCoords];

  // 스팟과 맛집 분리 (순서 유지)
  const orderedSpots = ordered.filter((p) => p.placeType === "spot");
  const orderedMeals = ordered.filter((p) => p.placeType === "meal");

  let spotIdx = 0;
  let mealIdx = 0;

  // === 오전 관광 ===
  while (spotIdx < orderedSpots.length && clock < 12 * 60 + 30) {
    const spot = orderedSpots[spotIdx];
    const dur = parseDurationMin(spot.duration);
    schedule.push({ time: formatTime(clock), type: "spot", ...spot });

    // 다음 장소까지 이동 시간 계산
    let travelTime = 15; // 기본 15분
    if (spotIdx + 1 < orderedSpots.length && spot.latitude && orderedSpots[spotIdx + 1].latitude) {
      const dist = haversineDistance(
        spot.latitude, spot.longitude,
        orderedSpots[spotIdx + 1].latitude, orderedSpots[spotIdx + 1].longitude
      );
      travelTime = Math.max(10, Math.round(estimatedTravelTime(dist, travelMode)));
    }

    clock += dur + travelTime;
    spotIdx++;
  }

  // === 점심 ===
  if (mealIdx < orderedMeals.length) {
    const lunchTime = Math.max(clock, 12 * 60);
    const lunch = orderedMeals[mealIdx];
    schedule.push({ time: formatTime(lunchTime), type: "meal", mealType: "점심", ...lunch });
    clock = lunchTime + 60 + 15; // 식사 60분 + 이동 15분
    mealIdx++;
  }

  // === 오후 관광 ===
  while (spotIdx < orderedSpots.length && clock < 17 * 60 + 30) {
    const spot = orderedSpots[spotIdx];
    const dur = parseDurationMin(spot.duration);
    schedule.push({ time: formatTime(clock), type: "spot", ...spot });

    let travelTime = 15;
    if (spotIdx + 1 < orderedSpots.length && spot.latitude && orderedSpots[spotIdx + 1].latitude) {
      const dist = haversineDistance(
        spot.latitude, spot.longitude,
        orderedSpots[spotIdx + 1].latitude, orderedSpots[spotIdx + 1].longitude
      );
      travelTime = Math.max(10, Math.round(estimatedTravelTime(dist, travelMode)));
    }

    clock += dur + travelTime;
    spotIdx++;
  }

  // === 저녁 ===
  if (mealIdx < orderedMeals.length && (totalDays > 1 || dayIndex === 0)) {
    const dinnerTime = Math.max(clock, 18 * 60);
    const dinner = orderedMeals[mealIdx];
    schedule.push({ time: formatTime(dinnerTime), type: "meal", mealType: "저녁", ...dinner });
    mealIdx++;
  }

  // === 남은 관광지 (시간 허용 시) ===
  while (spotIdx < orderedSpots.length) {
    // 시간이 너무 늦으면 생략
    if (clock > 19 * 60) break;
    const spot = orderedSpots[spotIdx];
    const dur = parseDurationMin(spot.duration);
    schedule.push({ time: formatTime(clock), type: "spot", ...spot });
    clock += dur + 15;
    spotIdx++;
  }

  return schedule;
}

// ─── 숙소 필터 ───
function parsePriceMin(priceRange) {
  if (!priceRange) return 0;
  const manMatch = priceRange.match(/(\d+)\s*만/);
  if (manMatch) return parseInt(manMatch[1]) * 10000;
  const match = priceRange.replace(/,/g, "").match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

function filterAccommodations(accommodations, selectedTypes, selectedPriceRange) {
  let filtered = accommodations;

  if (selectedTypes && selectedTypes.length > 0) {
    filtered = filtered.filter((a) => selectedTypes.includes(a.type));
  }

  if (selectedPriceRange && selectedPriceRange !== "상관없음") {
    const priceFiltered = filtered.filter((a) => {
      const min = parsePriceMin(a.priceRange);
      if (selectedPriceRange === "가성비") return min <= 70000;
      if (selectedPriceRange === "중간") return min > 70000 && min <= 150000;
      if (selectedPriceRange === "프리미엄") return min > 150000;
      return true;
    });
    if (priceFiltered.length > 0) filtered = priceFiltered;
  }

  return filtered;
}

// ============================================================
// 메인: 사용자 선택 기반 루트 최적화
// ============================================================
export function optimizeRoute({
  selectedSpots,
  selectedRestaurants,
  duration,
  travelMode,
  selectedRegions,
  selectedAccomTypes,
  selectedPriceRange,
}) {
  const days = getDayCount(duration);

  // 모든 선택 장소 합치기
  const allSpots = [...selectedSpots];
  const allMeals = [...selectedRestaurants];

  let dayGroups;

  if (days === 1) {
    // 당일치기: 모든 장소를 하나의 그룹
    dayGroups = [{ spots: allSpots, meals: allMeals }];
  } else {
    // 다일 여행: 관광지를 K-means로 일별 분배
    if (allSpots.length >= days) {
      const clusters = kMeansClusters(allSpots, days);
      const sorted = sortClustersByLocation(clusters);

      // 부족한 날이 있으면 빈 배열로 채움
      while (sorted.length < days) {
        sorted.push([]);
      }

      // 맛집도 각 Day에 배분 (가장 가까운 클러스터에)
      const mealsByDay = Array.from({ length: days }, () => []);
      for (const meal of allMeals) {
        if (!meal.latitude || !meal.longitude) {
          mealsByDay[0].push(meal);
          continue;
        }
        let bestDay = 0;
        let bestDist = Infinity;
        for (let d = 0; d < sorted.length; d++) {
          if (sorted[d].length === 0) continue;
          const centerLat = sorted[d].reduce((s, p) => s + p.latitude, 0) / sorted[d].length;
          const centerLon = sorted[d].reduce((s, p) => s + p.longitude, 0) / sorted[d].length;
          const dist = haversineDistance(meal.latitude, meal.longitude, centerLat, centerLon);
          if (dist < bestDist) {
            bestDist = dist;
            bestDay = d;
          }
        }
        mealsByDay[bestDay].push(meal);
      }

      dayGroups = sorted.map((spots, i) => ({
        spots,
        meals: mealsByDay[i] || [],
      }));
    } else {
      // 장소가 일수보다 적으면 단순 분배
      dayGroups = Array.from({ length: days }, (_, i) => ({
        spots: i < allSpots.length ? [allSpots[i]] : [],
        meals: i === 0 ? allMeals : [],
      }));
    }
  }

  // 각 Day별 일정 생성
  const itinerary = [];

  for (let day = 0; day < days; day++) {
    const group = dayGroups[day] || { spots: [], meals: [] };
    const schedule = buildDaySchedule(group.spots, group.meals, day, days, travelMode);

    // 숙소 선택 (마지막 날 제외)
    let accommodationOptions = [];
    if (days > 1 && day < days - 1) {
      const dayRegions = [...new Set(group.spots.map((s) => s.region))];
      if (dayRegions.length === 0) dayRegions.push(...selectedRegions);

      const dayAccom = [];
      dayRegions.forEach((regionName) => {
        const regionAccom = ALL_ACCOMMODATIONS[regionName] || [];
        regionAccom.forEach((a) => dayAccom.push({ ...a, region: regionName }));
      });

      const filtered = filterAccommodations(dayAccom, selectedAccomTypes, selectedPriceRange);
      accommodationOptions = (filtered.length > 0 ? filtered : dayAccom).slice(0, 3);
    }

    // Day 제목
    const dayRegions = [...new Set([
      ...group.spots.map((s) => s.region),
      ...group.meals.map((m) => m.region),
    ])].filter(Boolean);
    const regionLabel = dayRegions.length > 0 ? dayRegions.join(" · ") : selectedRegions.join(" · ");
    const dayTitle = days === 1
      ? `당일 여행 — ${regionLabel}`
      : `${day + 1}일차 — ${regionLabel}`;

    itinerary.push({
      day: day + 1,
      title: dayTitle,
      regions: dayRegions,
      schedule,
      accommodationOptions,
    });
  }

  // 교통 정보
  const transportInfo = selectedRegions.map((regionName) => {
    const region = REGIONS[regionName];
    if (!region) return { region: regionName, info: {} };
    return {
      region: regionName,
      info: travelMode === "뚜벅이(대중교통)"
        ? { type: "bus", ...region.busInfo }
        : { type: "car", driveTime: region.driveTime, parking: region.parking },
    };
  });

  return { itinerary, transportInfo };
}
