import { haversineDistance, estimatedTravelTime } from "./distance";
import { ALL_SPOTS } from "../data/spots";
import { REGIONAL_FOODS } from "../data/regionalFoods";
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

// ─── Zone 내 스팟 가져오기 ───
function getSpotsByZone(zone) {
  const spots = [];
  zone.regions.forEach((region) => {
    const regionSpots = ALL_SPOTS[region] || [];
    regionSpots.forEach((spot) => {
      if (spot.latitude && spot.longitude) {
        spots.push({ ...spot, region });
      }
    });
  });
  return spots;
}

// ─── Vibe 기반 점수 매기기 ───
function scoreByVibes(spots, selectedVibes) {
  return spots.map((spot) => {
    let score = 1; // 기본 점수
    if (selectedVibes.includes(spot.category)) {
      score += 3; // 카테고리 직접 매칭
    }
    if (spot.photoSpot && selectedVibes.includes("포토스팟/감성")) score += 1;
    if (spot.trekking && selectedVibes.includes("자연/트레킹")) score += 1;
    return { ...spot, vibeScore: score };
  });
}

// ─── 20분 제한 클러스터 생성 ───
function buildTimeLimitedClusters(spots, travelMode, maxMinutes = 20) {
  if (spots.length === 0) return [];

  // 점수 높은 순으로 정렬
  const sorted = [...spots].sort((a, b) => b.vibeScore - a.vibeScore);
  const used = new Set();
  const clusters = [];

  for (const seed of sorted) {
    if (used.has(seed.name + seed.region)) continue;

    const cluster = [seed];
    used.add(seed.name + seed.region);

    // 이 시드에서 maxMinutes 이내에 도달 가능한 스팟 추가
    for (const candidate of sorted) {
      if (used.has(candidate.name + candidate.region)) continue;

      // 클러스터 내 모든 스팟과 20분 이내인지 확인
      const allWithin = cluster.every((member) => {
        const dist = haversineDistance(
          member.latitude, member.longitude,
          candidate.latitude, candidate.longitude
        );
        const time = estimatedTravelTime(dist, travelMode);
        return time <= maxMinutes;
      });

      if (allWithin) {
        cluster.push(candidate);
        used.add(candidate.name + candidate.region);
      }
    }

    clusters.push(cluster);
  }

  return clusters;
}

// ─── 클러스터 점수 계산 ───
function clusterScore(cluster) {
  return cluster.reduce((sum, s) => sum + s.vibeScore, 0);
}

// ─── Day별 클러스터 배정 ───
function assignClustersToDay(clusters, days, spotsPerDay = 4) {
  // 클러스터를 총 점수순으로 정렬
  const sorted = [...clusters].sort((a, b) => clusterScore(b) - clusterScore(a));

  const dayGroups = Array.from({ length: days }, () => ({ spots: [], cluster: null }));

  // 최고 점수 클러스터부터 Day에 배분
  let dayIdx = 0;
  for (const cluster of sorted) {
    if (dayGroups[dayIdx].spots.length >= spotsPerDay) {
      dayIdx++;
      if (dayIdx >= days) break;
    }
    if (dayIdx >= days) break;

    const remaining = spotsPerDay - dayGroups[dayIdx].spots.length;
    const toAdd = cluster.slice(0, remaining);
    dayGroups[dayIdx].spots.push(...toAdd);
    if (!dayGroups[dayIdx].cluster) dayGroups[dayIdx].cluster = cluster;
  }

  // 빈 Day가 있으면 첫 번째 Day에서 분배
  for (let d = 0; d < days; d++) {
    if (dayGroups[d].spots.length === 0 && dayGroups[0].spots.length > 1) {
      dayGroups[d].spots.push(dayGroups[0].spots.pop());
    }
  }

  return dayGroups;
}

// ─── Nearest Neighbor 순서 최적화 ───
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

// ─── 하루 일정 빌드 ───
function buildDaySchedule(spots, foods, travelMode) {
  const schedule = [];
  let clock = 9 * 60 + 30; // 09:30

  const orderedSpots = nearestNeighborOrder(spots);
  const mealFoods = foods.filter((f) => f.category === "식사");
  const cafeFoods = foods.filter((f) => f.category === "간식/카페");
  let mealIdx = 0;
  let spotIdx = 0;

  // === 오전 관광 ===
  while (spotIdx < orderedSpots.length && clock < 12 * 60 + 30) {
    const spot = orderedSpots[spotIdx];
    const dur = parseDurationMin(spot.duration);
    schedule.push({ time: formatTime(clock), type: "spot", ...spot });

    let travelTime = 10;
    if (spotIdx + 1 < orderedSpots.length) {
      const dist = haversineDistance(
        spot.latitude, spot.longitude,
        orderedSpots[spotIdx + 1].latitude, orderedSpots[spotIdx + 1].longitude
      );
      travelTime = Math.max(5, Math.round(estimatedTravelTime(dist, travelMode)));
    }

    clock += dur + travelTime;
    spotIdx++;
  }

  // === 점심 ===
  if (mealIdx < mealFoods.length) {
    const lunchTime = Math.max(clock, 12 * 60);
    const food = mealFoods[mealIdx];
    schedule.push({
      time: formatTime(lunchTime), type: "meal", mealType: "점심",
      name: food.name, emoji: food.emoji, description: food.description,
      restaurants: food.restaurants,
    });
    clock = lunchTime + 60 + 10;
    mealIdx++;
  }

  // === 오후 관광 ===
  while (spotIdx < orderedSpots.length && clock < 17 * 60 + 30) {
    const spot = orderedSpots[spotIdx];
    const dur = parseDurationMin(spot.duration);
    schedule.push({ time: formatTime(clock), type: "spot", ...spot });

    let travelTime = 10;
    if (spotIdx + 1 < orderedSpots.length) {
      const dist = haversineDistance(
        spot.latitude, spot.longitude,
        orderedSpots[spotIdx + 1].latitude, orderedSpots[spotIdx + 1].longitude
      );
      travelTime = Math.max(5, Math.round(estimatedTravelTime(dist, travelMode)));
    }

    clock += dur + travelTime;
    spotIdx++;
  }

  // === 카페 ===
  if (cafeFoods.length > 0 && clock < 17 * 60 + 30) {
    const cafeTime = Math.max(clock, 15 * 60);
    const cafe = cafeFoods[0];
    schedule.push({
      time: formatTime(cafeTime), type: "meal", mealType: "카페",
      name: cafe.name, emoji: cafe.emoji, description: cafe.description,
      restaurants: cafe.restaurants,
    });
    clock = cafeTime + 40 + 10;
  }

  // === 저녁 ===
  if (mealIdx < mealFoods.length) {
    const dinnerTime = Math.max(clock, 18 * 60);
    const food = mealFoods[mealIdx];
    schedule.push({
      time: formatTime(dinnerTime), type: "meal", mealType: "저녁",
      name: food.name, emoji: food.emoji, description: food.description,
      restaurants: food.restaurants,
    });
    mealIdx++;
  }

  // === 남은 관광지 ===
  while (spotIdx < orderedSpots.length && clock < 19 * 60) {
    const spot = orderedSpots[spotIdx];
    const dur = parseDurationMin(spot.duration);
    schedule.push({ time: formatTime(clock), type: "spot", ...spot });
    clock += dur + 10;
    spotIdx++;
  }

  return schedule;
}

// ─── 대안 스팟 생성 (교체용) ───
function buildAlternatives(selectedSpots, allZoneSpots, travelMode) {
  const alternatives = {};
  const selectedNames = new Set(selectedSpots.map((s) => s.name + s.region));

  for (const spot of selectedSpots) {
    const alts = allZoneSpots
      .filter((s) => !selectedNames.has(s.name + s.region))
      .map((s) => {
        const dist = haversineDistance(
          spot.latitude, spot.longitude, s.latitude, s.longitude
        );
        const time = Math.round(estimatedTravelTime(dist, travelMode));
        return { ...s, travelTimeFromCurrent: time };
      })
      .filter((s) => s.travelTimeFromCurrent <= 25)
      .sort((a, b) => b.vibeScore - a.vibeScore || a.travelTimeFromCurrent - b.travelTimeFromCurrent)
      .slice(0, 3);

    if (alts.length > 0) {
      alternatives[spot.name] = alts;
    }
  }

  return alternatives;
}

// ─── 음식 자동 배정 ───
function autoAssignFoods(daySpots) {
  const regions = [...new Set(daySpots.map((s) => s.region))];
  const foods = [];

  for (const region of regions) {
    const regionFoods = REGIONAL_FOODS[region] || [];
    regionFoods.forEach((f) => foods.push({ ...f, region }));
  }

  // 중복 제거 후 식사 2개 + 카페 1개 한도
  const meals = foods.filter((f) => f.category === "식사").slice(0, 2);
  const cafes = foods.filter((f) => f.category === "간식/카페").slice(0, 1);
  return [...meals, ...cafes];
}

// ============================================================
// 메인: 자동 루트 생성
// ============================================================
export function generateRoute({ selectedZone, selectedVibes, duration, travelMode }) {
  const days = getDayCount(duration);

  // 1. Zone 내 스팟 수집
  const allZoneSpots = getSpotsByZone(selectedZone);

  // 2. Vibe 점수 매기기
  const scored = scoreByVibes(allZoneSpots, selectedVibes);

  // 3. 20분 클러스터 생성
  const clusters = buildTimeLimitedClusters(scored, travelMode, 20);

  // 4. Day별 배정
  const spotsPerDay = days === 1 ? 5 : 4;
  const dayGroups = assignClustersToDay(clusters, days, spotsPerDay);

  // 5. 각 Day별 일정 생성
  const itinerary = [];
  const allSelectedSpots = [];

  for (let day = 0; day < days; day++) {
    const group = dayGroups[day] || { spots: [] };
    const daySpots = group.spots;
    allSelectedSpots.push(...daySpots);

    // 음식 자동 배정
    const dayFoods = autoAssignFoods(daySpots);

    // 스케줄 빌드
    const schedule = buildDaySchedule(daySpots, dayFoods, travelMode);

    // 숙소 (마지막 날 제외)
    let accommodationOptions = [];
    if (days > 1 && day < days - 1) {
      const dayRegions = [...new Set(daySpots.map((s) => s.region))];
      if (dayRegions.length === 0) dayRegions.push(...selectedZone.regions);

      const dayAccom = [];
      dayRegions.forEach((regionName) => {
        const regionAccom = ALL_ACCOMMODATIONS[regionName] || [];
        regionAccom.forEach((a) => dayAccom.push({ ...a, region: regionName }));
      });
      accommodationOptions = dayAccom.slice(0, 3);
    }

    // Day 제목
    const dayRegions = [...new Set(daySpots.map((s) => s.region))].filter(Boolean);
    const regionLabel = dayRegions.length > 0
      ? dayRegions.join(" · ")
      : selectedZone.regions.slice(0, 2).join(" · ");
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

  // 6. 대안 스팟 (교체용)
  const alternatives = buildAlternatives(allSelectedSpots, scored, travelMode);

  // 7. 교통 정보
  const transportRegions = [...new Set(allSelectedSpots.map((s) => s.region))];
  const transportInfo = transportRegions.map((regionName) => {
    const region = REGIONS[regionName];
    if (!region) return { region: regionName, info: {} };
    return {
      region: regionName,
      info: travelMode === "뚜벅이(대중교통)"
        ? { type: "bus", ...region.busInfo }
        : { type: "car", driveTime: region.driveTime, parking: region.parking },
    };
  });

  return { itinerary, transportInfo, alternatives, zone: selectedZone, vibes: selectedVibes };
}
