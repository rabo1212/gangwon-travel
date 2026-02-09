// 정적 데이터 + TourAPI 데이터를 통합하는 프로바이더
// API 실패 시 정적 데이터로 자동 fallback

import { ALL_SPOTS } from "../data/spots";
import { ALL_RESTAURANTS } from "../data/restaurants";
import { ALL_ACCOMMODATIONS } from "../data/accommodations";
import * as tourApi from "./tourApiService";

// 이름 기준 중복 제거 (정적 데이터 우선)
function mergeByName(staticData, apiData) {
  const staticNames = new Set(staticData.map((s) => s.name));
  const newItems = apiData.filter((item) => !staticNames.has(item.name));
  return [
    ...staticData.map((s) => ({ ...s, source: "static" })),
    ...newItems,
  ];
}

// ===== 관광지: 정적 + API =====
export async function getSpots(region) {
  const staticSpots = ALL_SPOTS[region] || [];

  try {
    const apiSpots = await tourApi.fetchSpots(region);
    return mergeByName(staticSpots, apiSpots);
  } catch (err) {
    console.warn(`TourAPI spots 조회 실패 (${region}):`, err.message);
    return staticSpots.map((s) => ({ ...s, source: "static" }));
  }
}

// ===== 음식점: 정적 + API =====
export async function getRestaurants(region) {
  const staticRestaurants = ALL_RESTAURANTS[region] || [];

  try {
    const apiRestaurants = await tourApi.fetchRestaurants(region);
    return mergeByName(staticRestaurants, apiRestaurants);
  } catch (err) {
    console.warn(`TourAPI restaurants 조회 실패 (${region}):`, err.message);
    return staticRestaurants.map((r) => ({ ...r, source: "static" }));
  }
}

// ===== 숙박: 정적 + API =====
export async function getAccommodations(region) {
  const staticAccom = ALL_ACCOMMODATIONS[region] || [];

  try {
    const apiAccom = await tourApi.fetchAccommodations(region);
    return mergeByName(staticAccom, apiAccom);
  } catch (err) {
    console.warn(`TourAPI accommodations 조회 실패 (${region}):`, err.message);
    return staticAccom.map((a) => ({ ...a, source: "static" }));
  }
}
