// ===== 강원도 장소별 이미지 시스템 =====
// 실제 이미지가 없으면 null 반환 → 컴포넌트에서 그라데이션 fallback 사용

// TourAPI에서 수집한 실제 관광지/맛집 이미지 (한국관광공사 공식 사진)
import spotImageUrls from "../data/spotImageUrls.json";
import restaurantImageUrls from "../data/restaurantImageUrls.json";

/**
 * 관광지 실제 이미지 URL 반환
 * 실제 이미지가 없으면 null (컴포넌트에서 그라데이션 표시)
 */
export function getSpotImageUrl(spot) {
  // 1) 데이터에 imageUrl이 있으면 최우선 (API 연동 또는 정적 데이터)
  if (spot.imageUrl) return spot.imageUrl;

  // 2) TourAPI 수집 이미지 (한국관광공사 공식 사진)
  if (spotImageUrls[spot.name]) return spotImageUrls[spot.name];

  // 실제 이미지 없음 → null 반환
  return null;
}

/**
 * 음식점 실제 이미지 URL 반환
 * 실제 이미지가 없으면 null (컴포넌트에서 그라데이션 표시)
 */
export function getFoodImageUrl(item) {
  // 1) 데이터에 imageUrl이 있으면 최우선
  if (item.imageUrl) return item.imageUrl;

  // 2) TourAPI 수집 이미지
  if (restaurantImageUrls[item.name]) return restaurantImageUrls[item.name];

  // 실제 이미지 없음 → null 반환
  return null;
}

// 카테고리별 그라데이션 (실제 이미지 없을 때 배경)
const GRADIENTS = {
  "휴양/힐링": "from-emerald-600 to-teal-700",
  "체험/액티비티": "from-orange-500 to-amber-600",
  "맛집/미식": "from-red-500 to-rose-600",
  "문화/역사": "from-blue-600 to-indigo-700",
  "포토스팟/감성": "from-purple-500 to-fuchsia-600",
  "자연/트레킹": "from-green-600 to-emerald-700",
};

export function getSpotGradient(category) {
  return GRADIENTS[category] || "from-slate-600 to-gray-700";
}
