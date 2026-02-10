// ===== 강원도 장소별 / 지역별 / 카테고리별 이미지 시스템 =====

// TourAPI에서 수집한 실제 관광지/맛집 이미지 (한국관광공사 공식 사진)
import spotImageUrls from "../data/spotImageUrls.json";
import restaurantImageUrls from "../data/restaurantImageUrls.json";

// 유명 장소 직접 매핑 (장소 이름 → Unsplash 이미지 ID) — 최후의 fallback
const SPOT_IMAGES = {
  // 춘천
  "남이섬": "photo-1605379399642-870262d3d051",
  "소양강 스카이워크": "photo-1506905925346-21bda4d32df4",
  "강촌레일파크": "photo-1533130061792-64b345e4a833",
  "삼악산 케이블카": "photo-1464822759023-fed622ff2c3b",
  // 강릉
  "경포대": "photo-1507525428034-b723cf961d3e",
  "안목해변 커피거리": "photo-1495474472287-4d71bcdd2085",
  "오죽헌": "photo-1578662996442-48f60103fc96",
  "정동진 해돋이 공원": "photo-1507400492013-162706c8c05e",
  "강릉 중앙시장": "photo-1555396273-367ea4eb4db5",
  "초당순두부마을": "photo-1498654896293-37aacf113fd9",
  "대관령 양떼목장": "photo-1484557985045-edf25e08da73",
  "선교장": "photo-1583037189850-1921ae7c6c22",
  // 속초
  "설악산 국립공원": "photo-1464822759023-fed622ff2c3b",
  "속초 중앙시장 & 관광수산시장": "photo-1555396273-367ea4eb4db5",
  "속초해수욕장": "photo-1507525428034-b723cf961d3e",
  "아바이마을": "photo-1583037189850-1921ae7c6c22",
  "외옹치 바다향기로": "photo-1494500764479-0c8f2919a3d8",
  "대포항": "photo-1545579133-99bb5ab189bd",
  "울산바위": "photo-1519681393784-d120267933ba",
  // 양양
  "낙산해수욕장": "photo-1507525428034-b723cf961d3e",
  "낙산사": "photo-1578662996442-48f60103fc96",
  "서피비치": "photo-1502680390548-bdbac40cee81",
  "하조대": "photo-1469474968028-56623f02e42e",
  // 평창
  "월정사": "photo-1578662996442-48f60103fc96",
  "오대산 국립공원": "photo-1448375240586-882707db888b",
  "알펜시아 리조트": "photo-1519681393784-d120267933ba",
  "이효석 문화마을": "photo-1490750967868-88aa4f44baee",
  "대관령 하늘목장": "photo-1484557985045-edf25e08da73",
  // 정선
  "정선 레일바이크": "photo-1533130061792-64b345e4a833",
  "화암동굴": "photo-1504700610630-ac6edd8b5727",
  "아우라지": "photo-1682687982501-1e58ab814714",
  "민둥산": "photo-1464822759023-fed622ff2c3b",
  "하이원리조트": "photo-1519681393784-d120267933ba",
  // 영월
  "청령포": "photo-1682687982501-1e58ab814714",
  "별마로천문대": "photo-1419242902214-272b3f66ee7a",
  "한반도 지형": "photo-1506905925346-21bda4d32df4",
  "영월 동강래프팅": "photo-1530541930197-dc22b0bcd9bf",
  // 동해
  "묵호등대": "photo-1545579133-99bb5ab189bd",
  "추암촛대바위": "photo-1469474968028-56623f02e42e",
  "무릉계곡": "photo-1470071459604-3b5ec3a7fe05",
  // 삼척
  "환선굴": "photo-1504700610630-ac6edd8b5727",
  "장호항": "photo-1545579133-99bb5ab189bd",
  "삼척 해상케이블카": "photo-1507525428034-b723cf961d3e",
  // 태백
  "태백산 국립공원": "photo-1519681393784-d120267933ba",
  "검룡소": "photo-1470071459604-3b5ec3a7fe05",
  "매봉산 풍력발전단지": "photo-1532601224476-15c79f2f7a51",
  // 고성
  "통일전망대": "photo-1506905925346-21bda4d32df4",
  "화진포 해변": "photo-1507525428034-b723cf961d3e",
  // 인제
  "내설악 백담사": "photo-1578662996442-48f60103fc96",
  "원대리 자작나무숲": "photo-1448375240586-882707db888b",
  "인제 래프팅 체험": "photo-1530541930197-dc22b0bcd9bf",
  // 화천
  "파로호": "photo-1682687982501-1e58ab814714",
  "화천 산천어축제 행사장": "photo-1551632811-561732d1e306",
  "평화의 댐": "photo-1506905925346-21bda4d32df4",
  // 철원
  "한탄강 주상절리길": "photo-1469474968028-56623f02e42e",
  "고석정": "photo-1470071459604-3b5ec3a7fe05",
  "철원 한탄강 물윗길": "photo-1682687982501-1e58ab814714",
  // 원주
  "뮤지엄 산": "photo-1513635269975-59663e0ac1ad",
  "소금산 출렁다리": "photo-1551632811-561732d1e306",
  "치악산 국립공원": "photo-1464822759023-fed622ff2c3b",
  // 횡성
  "웰리힐리파크": "photo-1519681393784-d120267933ba",
  "청태산자연휴양림": "photo-1448375240586-882707db888b",
  "횡성호수길": "photo-1682687982501-1e58ab814714",
  // 홍천
  "비발디파크": "photo-1519681393784-d120267933ba",
  "알파카월드": "photo-1484557985045-edf25e08da73",
  "홍천 은행나무숲": "photo-1490750967868-88aa4f44baee",
  // 양구
  "두타연": "photo-1470071459604-3b5ec3a7fe05",
  "박수근미술관": "photo-1513635269975-59663e0ac1ad",
};

// 지역별 이미지 풀 (해안/산간/내륙)
const REGION_IMAGES = {
  coastal: [ // 강릉, 속초, 양양, 동해, 삼척, 고성
    "photo-1507525428034-b723cf961d3e",
    "photo-1502680390548-bdbac40cee81",
    "photo-1545579133-99bb5ab189bd",
    "photo-1469474968028-56623f02e42e",
    "photo-1476673160081-cf065607f449",
    "photo-1505142468610-359e7d316be0",
    "photo-1519046904884-53103b34b206",
    "photo-1494500764479-0c8f2919a3d8",
    "photo-1510414842594-a61c69b5ae57",
    "photo-1518837695005-2083093ee35b",
  ],
  mountain: [ // 평창, 정선, 태백, 인제, 화천, 양구, 철원, 횡성
    "photo-1464822759023-fed622ff2c3b",
    "photo-1506905925346-21bda4d32df4",
    "photo-1519681393784-d120267933ba",
    "photo-1448375240586-882707db888b",
    "photo-1470071459604-3b5ec3a7fe05",
    "photo-1441974231531-c6227db76b6e",
    "photo-1418065460487-3e41a6c84dc5",
    "photo-1551632436-cbf8dd35adfa",
    "photo-1501785888041-af3ef285b470",
    "photo-1532601224476-15c79f2f7a51",
  ],
  lakeside: [ // 춘천, 화천, 영월, 홍천
    "photo-1682687982501-1e58ab814714",
    "photo-1506905925346-21bda4d32df4",
    "photo-1501785888041-af3ef285b470",
    "photo-1470071459604-3b5ec3a7fe05",
    "photo-1441974231531-c6227db76b6e",
    "photo-1530541930197-dc22b0bcd9bf",
    "photo-1476673160081-cf065607f449",
    "photo-1494500764479-0c8f2919a3d8",
  ],
};

// 지역 → 풍경 타입 매핑
const REGION_TYPE = {
  "강릉시": "coastal", "속초시": "coastal", "양양군": "coastal",
  "동해시": "coastal", "삼척시": "coastal", "고성군": "coastal",
  "평창군": "mountain", "정선군": "mountain", "태백시": "mountain",
  "인제군": "mountain", "횡성군": "mountain", "철원군": "mountain",
  "양구군": "mountain",
  "춘천시": "lakeside", "화천군": "lakeside", "영월군": "lakeside",
  "홍천군": "lakeside", "원주시": "mountain", "홍천군": "lakeside",
};

// 카테고리별 이미지 풀 (확장: 각 10~15장)
const CATEGORY_IMAGES = {
  "휴양/힐링": [
    "photo-1682687982501-1e58ab814714",
    "photo-1506905925346-21bda4d32df4",
    "photo-1501785888041-af3ef285b470",
    "photo-1470071459604-3b5ec3a7fe05",
    "photo-1441974231531-c6227db76b6e",
    "photo-1476673160081-cf065607f449",
    "photo-1494500764479-0c8f2919a3d8",
    "photo-1484557985045-edf25e08da73",
    "photo-1490750967868-88aa4f44baee",
    "photo-1518837695005-2083093ee35b",
  ],
  "체험/액티비티": [
    "photo-1551632811-561732d1e306",
    "photo-1504280390367-361c6d9f38f4",
    "photo-1530541930197-dc22b0bcd9bf",
    "photo-1517824806704-9040b037703b",
    "photo-1533130061792-64b345e4a833",
    "photo-1502680390548-bdbac40cee81",
    "photo-1519046904884-53103b34b206",
    "photo-1504700610630-ac6edd8b5727",
    "photo-1532601224476-15c79f2f7a51",
    "photo-1551632436-cbf8dd35adfa",
  ],
  "맛집/미식": [
    "photo-1498654896293-37aacf113fd9",
    "photo-1504674900247-0877df9cc836",
    "photo-1555396273-367ea4eb4db5",
    "photo-1567620905732-2d1ec7ab7445",
    "photo-1414235077428-338989a2e8c0",
    "photo-1540189549336-e6e99c3679fe",
    "photo-1476224203421-9ac39bcb3327",
    "photo-1565299624946-b28f40a0ae38",
    "photo-1546069901-ba9599a7e63c",
    "photo-1529692236671-f1f6cf9683ba",
  ],
  "문화/역사": [
    "photo-1583037189850-1921ae7c6c22",
    "photo-1548115184-bc6544d06a58",
    "photo-1578662996442-48f60103fc96",
    "photo-1547981609-4b6bfe67ca0b",
    "photo-1513635269975-59663e0ac1ad",
    "photo-1419242902214-272b3f66ee7a",
    "photo-1513635269975-59663e0ac1ad",
    "photo-1505142468610-359e7d316be0",
  ],
  "포토스팟/감성": [
    "photo-1490750967868-88aa4f44baee",
    "photo-1507400492013-162706c8c05e",
    "photo-1494500764479-0c8f2919a3d8",
    "photo-1469474968028-56623f02e42e",
    "photo-1465056836900-8f1e4f8a93a5",
    "photo-1510414842594-a61c69b5ae57",
    "photo-1476673160081-cf065607f449",
    "photo-1518837695005-2083093ee35b",
    "photo-1484557985045-edf25e08da73",
  ],
  "자연/트레킹": [
    "photo-1551632436-cbf8dd35adfa",
    "photo-1464822759023-fed622ff2c3b",
    "photo-1519681393784-d120267933ba",
    "photo-1418065460487-3e41a6c84dc5",
    "photo-1448375240586-882707db888b",
    "photo-1470071459604-3b5ec3a7fe05",
    "photo-1441974231531-c6227db76b6e",
    "photo-1501785888041-af3ef285b470",
    "photo-1506905925346-21bda4d32df4",
    "photo-1532601224476-15c79f2f7a51",
  ],
};

// 음식 타입별 이미지 풀
const FOOD_IMAGES = {
  "한식": [
    "photo-1498654896293-37aacf113fd9",
    "photo-1504674900247-0877df9cc836",
    "photo-1567620905732-2d1ec7ab7445",
    "photo-1546069901-ba9599a7e63c",
    "photo-1529692236671-f1f6cf9683ba",
  ],
  "카페": [
    "photo-1495474472287-4d71bcdd2085",
    "photo-1509042239860-f550ce710b93",
    "photo-1501339847302-ac426a4a7cbb",
    "photo-1442512595331-e89e73853f31",
    "photo-1559496417-e7f25cb247f3",
  ],
  "default": [
    "photo-1555396273-367ea4eb4db5",
    "photo-1414235077428-338989a2e8c0",
    "photo-1540189549336-e6e99c3679fe",
    "photo-1476224203421-9ac39bcb3327",
    "photo-1565299624946-b28f40a0ae38",
  ],
};

// 스팟 이름 해시 → 일관된 이미지
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getSpotImageUrl(spot, width = 400, height = 300) {
  // 1) 데이터에 imageUrl이 있으면 최우선 (API 연동 또는 정적 데이터)
  if (spot.imageUrl) return spot.imageUrl;

  // 2) TourAPI 수집 이미지 (한국관광공사 공식 사진)
  if (spotImageUrls[spot.name]) return spotImageUrls[spot.name];

  // 3) Unsplash 직접 매핑 (최후의 fallback)
  if (SPOT_IMAGES[spot.name]) {
    const id = SPOT_IMAGES[spot.name];
    return `https://images.unsplash.com/${id}?w=${width}&h=${height}&fit=crop&auto=format&q=80`;
  }

  const hash = hashString(spot.name);

  // 3) 지역별 풍경 풀 (50% 확률)
  const regionType = REGION_TYPE[spot.region];
  if (regionType && hash % 2 === 0) {
    const pool = REGION_IMAGES[regionType];
    const id = pool[hash % pool.length];
    return `https://images.unsplash.com/${id}?w=${width}&h=${height}&fit=crop&auto=format&q=80`;
  }

  // 4) 카테고리 풀
  const pool = CATEGORY_IMAGES[spot.category] || CATEGORY_IMAGES["휴양/힐링"];
  const id = pool[hash % pool.length];
  return `https://images.unsplash.com/${id}?w=${width}&h=${height}&fit=crop&auto=format&q=80`;
}

// 음식점 이미지 URL
export function getFoodImageUrl(item, width = 400, height = 250) {
  // 1) 데이터에 imageUrl이 있으면 최우선
  if (item.imageUrl) return item.imageUrl;

  // 2) TourAPI 수집 이미지
  if (restaurantImageUrls[item.name]) return restaurantImageUrls[item.name];

  // 3) Unsplash fallback
  const hash = hashString(item.name || "food");
  const isCafe = item.mealType === "카페" || item.genre === "카페/베이커리";
  const pool = isCafe ? FOOD_IMAGES["카페"] : (FOOD_IMAGES[item.genre] || FOOD_IMAGES["default"]);
  const id = pool[hash % pool.length];
  return `https://images.unsplash.com/${id}?w=${width}&h=${height}&fit=crop&auto=format&q=80`;
}

// 카테고리별 폴백 그라데이션
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
