// 카테고리별 Unsplash 이미지 ID 풀 (강원도/한국 풍경)
const CATEGORY_IMAGES = {
  "휴양/힐링": [
    "photo-1682687982501-1e58ab814714", // 호수 풍경
    "photo-1506905925346-21bda4d32df4", // 산 풍경
    "photo-1501785888041-af3ef285b470", // 자연 힐링
    "photo-1470071459604-3b5ec3a7fe05", // 숲 풍경
    "photo-1441974231531-c6227db76b6e", // 자연
  ],
  "체험/액티비티": [
    "photo-1551632811-561732d1e306", // 하이킹
    "photo-1504280390367-361c6d9f38f4", // 캠핑
    "photo-1530541930197-dc22b0bcd9bf", // 래프팅
    "photo-1517824806704-9040b037703b", // 산악
    "photo-1533130061792-64b345e4a833", // 자전거
  ],
  "맛집/미식": [
    "photo-1498654896293-37aacf113fd9", // 한식
    "photo-1504674900247-0877df9cc836", // 음식
    "photo-1555396273-367ea4eb4db5", // 레스토랑
    "photo-1567620905732-2d1ec7ab7445", // 음식2
    "photo-1414235077428-338989a2e8c0", // 파인다이닝
  ],
  "문화/역사": [
    "photo-1583037189850-1921ae7c6c22", // 한옥
    "photo-1548115184-bc6544d06a58", // 전통건축
    "photo-1578662996442-48f60103fc96", // 한국 문화
    "photo-1547981609-4b6bfe67ca0b", // 박물관
    "photo-1513635269975-59663e0ac1ad", // 도시 야경
  ],
  "포토스팟/감성": [
    "photo-1490750967868-88aa4f44baee", // 감성 풍경
    "photo-1507400492013-162706c8c05e", // 일출
    "photo-1494500764479-0c8f2919a3d8", // 숲 길
    "photo-1469474968028-56623f02e42e", // 황금빛 풍경
    "photo-1465056836900-8f1e4f8a93a5", // 풍경
  ],
  "자연/트레킹": [
    "photo-1551632436-cbf8dd35adfa", // 트레킹
    "photo-1464822759023-fed622ff2c3b", // 산
    "photo-1519681393784-d120267933ba", // 설산
    "photo-1418065460487-3e41a6c84dc5", // 숲 트레일
    "photo-1448375240586-882707db888b", // 숲 안개
  ],
};

// 이모지 기반 보조 이미지
const EMOJI_IMAGES = {
  "🌊": "photo-1507525428034-b723cf961d3e", // 바다
  "🏔️": "photo-1464822759023-fed622ff2c3b", // 산
  "🌅": "photo-1507400492013-162706c8c05e", // 일출
  "☕": "photo-1495474472287-4d71bcdd2085", // 카페
  "🍲": "photo-1498654896293-37aacf113fd9", // 한식
  "🏠": "photo-1583037189850-1921ae7c6c22", // 한옥
  "🎨": "photo-1513364776144-60967b0f800f", // 아트
  "🌲": "photo-1448375240586-882707db888b", // 숲
  "🏖️": "photo-1507525428034-b723cf961d3e", // 해변
  "🗻": "photo-1506905925346-21bda4d32df4", // 산
  "🌳": "photo-1441974231531-c6227db76b6e", // 나무
  "🏛️": "photo-1548115184-bc6544d06a58", // 건축
  "⛷️": "photo-1519681393784-d120267933ba", // 스키
  "🚣": "photo-1530541930197-dc22b0bcd9bf", // 래프팅
  "🐑": "photo-1504280390367-361c6d9f38f4", // 자연
  "🦅": "photo-1444464666168-49d633b86797", // 새
  "🌿": "photo-1470071459604-3b5ec3a7fe05", // 자연
};

// 스팟 이름 해시 → 같은 스팟은 항상 같은 이미지
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getSpotImageUrl(spot, width = 400, height = 200) {
  // 1) 이모지로 특정 이미지 매칭 시도
  const emojiImage = EMOJI_IMAGES[spot.emoji];

  // 2) 카테고리별 이미지 풀
  const pool = CATEGORY_IMAGES[spot.category] || CATEGORY_IMAGES["휴양/힐링"];

  // 3) 이름 해시로 풀에서 일관된 선택
  const hash = hashString(spot.name);

  // 이모지 매치 50% 확률, 카테고리 풀 50% 확률
  const imageId =
    emojiImage && hash % 2 === 0
      ? emojiImage
      : pool[hash % pool.length];

  return `https://images.unsplash.com/${imageId}?w=${width}&h=${height}&fit=crop&auto=format&q=75`;
}

// 카테고리별 폴백 그라데이션
const GRADIENTS = {
  "휴양/힐링": "from-green-400 to-teal-500",
  "체험/액티비티": "from-orange-400 to-amber-500",
  "맛집/미식": "from-red-400 to-pink-500",
  "문화/역사": "from-blue-400 to-indigo-500",
  "포토스팟/감성": "from-purple-400 to-pink-400",
  "자연/트레킹": "from-emerald-500 to-green-600",
};

export function getSpotGradient(category) {
  return GRADIENTS[category] || "from-gray-400 to-slate-500";
}
