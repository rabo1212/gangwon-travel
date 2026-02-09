// TourAPI 응답을 앱 데이터 형식으로 변환하는 서비스

const API_BASE = "/api/tour";

// ===== 프록시 호출 =====
async function fetchFromProxy(endpoint, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE}/${endpoint}?${query}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Proxy HTTP ${res.status}`);

  const data = await res.json();
  if (!data.success) throw new Error(data.error || "API Error");

  return data.items || [];
}

// ===== 카테고리 매핑 =====
function mapToAppCategory(item) {
  const cat1 = item.cat1 || "";
  const cat2 = item.cat2 || "";
  const contentTypeId = String(item.contenttypeid || "");

  if (contentTypeId === "28") return "체험/액티비티";
  if (contentTypeId === "14") return "문화/역사";
  if (contentTypeId === "15") return "체험/액티비티";

  if (cat1 === "A01") return "자연/트레킹";
  if (cat2 === "A0201") return "문화/역사";
  if (cat2 === "A0202") return "휴양/힐링";
  if (cat2 === "A0203") return "체험/액티비티";
  if (cat2 === "A0205") return "맛집/미식";

  return "휴양/힐링";
}

const CATEGORY_EMOJI = {
  "휴양/힐링": "🧘",
  "체험/액티비티": "🤸",
  "맛집/미식": "🍽️",
  "문화/역사": "🏛️",
  "포토스팟/감성": "📸",
  "자연/트레킹": "🌲",
};

function stripHtml(str) {
  if (!str) return "";
  return str.replace(/<[^>]*>/g, "").trim();
}

function guessAccommodationType(title) {
  if (!title) return "숙소";
  if (title.includes("호텔")) return "호텔";
  if (title.includes("리조트")) return "리조트";
  if (title.includes("펜션")) return "펜션";
  if (title.includes("게스트하우스") || title.includes("게하")) return "게스트하우스";
  if (title.includes("한옥")) return "한옥스테이";
  if (title.includes("글램핑")) return "펜션";
  if (title.includes("캠핑")) return "펜션";
  return "호텔";
}

// ===== 관광지 매퍼 =====
export function mapToSpot(item, regionName) {
  const category = mapToAppCategory(item);
  return {
    name: item.title || "",
    region: regionName || "",
    category,
    emoji: CATEGORY_EMOJI[category] || "📍",
    description: stripHtml(item.overview) || `${item.title || ""} - ${regionName} 관광지`,
    address: item.addr1 ? `${item.addr1}${item.addr2 ? " " + item.addr2 : ""}` : "",
    latitude: parseFloat(item.mapy) || 0,
    longitude: parseFloat(item.mapx) || 0,
    hours: "운영시간 확인필요",
    tip: "",
    duration: "1~2시간",
    photoSpot: false,
    trekking: category === "자연/트레킹",
    imageUrl: item.firstimage || null,
    imageUrl2: item.firstimage2 || null,
    contentId: item.contentid || null,
    contentTypeId: item.contenttypeid || null,
    source: "tourapi",
  };
}

// ===== 음식점 매퍼 =====
export function mapToRestaurant(item, regionName) {
  return {
    name: item.title || "",
    region: regionName || "",
    emoji: "🍽️",
    genre: "한식",
    styleTags: [],
    mainMenu: "",
    priceRange: "",
    hours: "",
    address: item.addr1 ? `${item.addr1}${item.addr2 ? " " + item.addr2 : ""}` : "",
    latitude: parseFloat(item.mapy) || 0,
    longitude: parseFloat(item.mapx) || 0,
    description: stripHtml(item.overview) || item.title || "",
    imageUrl: item.firstimage || null,
    contentId: item.contentid || null,
    source: "tourapi",
  };
}

// ===== 숙박 매퍼 =====
export function mapToAccommodation(item, regionName) {
  return {
    name: item.title || "",
    type: guessAccommodationType(item.title),
    priceRange: "",
    address: item.addr1 ? `${item.addr1}${item.addr2 ? " " + item.addr2 : ""}` : "",
    latitude: parseFloat(item.mapy) || 0,
    longitude: parseFloat(item.mapx) || 0,
    description: stripHtml(item.overview) || item.title || "",
    features: [],
    checkIn: "15:00",
    checkOut: "11:00",
    tip: "",
    imageUrl: item.firstimage || null,
    contentId: item.contentid || null,
    source: "tourapi",
  };
}

// ===== Public API =====
export async function fetchSpots(region, options = {}) {
  const { page = 1, numOfRows = 20 } = options;
  const items = await fetchFromProxy("spots", { region, page, numOfRows });
  return items.map((item) => mapToSpot(item, region));
}

export async function fetchRestaurants(region, options = {}) {
  const { page = 1, numOfRows = 20 } = options;
  const items = await fetchFromProxy("restaurants", { region, page, numOfRows });
  return items.map((item) => mapToRestaurant(item, region));
}

export async function fetchAccommodations(region, options = {}) {
  const { page = 1, numOfRows = 20 } = options;
  const items = await fetchFromProxy("accommodations", { region, page, numOfRows });
  return items.map((item) => mapToAccommodation(item, region));
}

export async function fetchDetail(contentId, contentTypeId) {
  const params = { contentId };
  if (contentTypeId) params.contentTypeId = contentTypeId;
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/detail?${query}`);
  const data = await res.json();
  return data;
}
