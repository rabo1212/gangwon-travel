/**
 * 한국관광공사 Tour API로 강원도 맛집 대표 이미지를 수집하는 스크립트
 * 실행: node scripts/fetch-restaurant-images.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "src", "data", "restaurants");
const OUTPUT_PATH = path.join(__dirname, "..", "src", "data", "restaurantImageUrls.json");

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("ERROR: .env.local 파일이 없습니다.");
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, "utf-8");
  const match = content.match(/TOUR_API_KEY=(.+)/);
  if (!match || !match[1].trim()) {
    console.error("ERROR: .env.local 에 TOUR_API_KEY 가 없습니다.");
    process.exit(1);
  }
  return match[1].trim();
}

const BASE_URL = "https://apis.data.go.kr/B551011/KorService2/searchKeyword2";
const GANGWON_AREA_CODE = "32";

async function searchRestaurantImage(serviceKey, name) {
  const params = new URLSearchParams({
    serviceKey,
    MobileOS: "ETC",
    MobileApp: "GangwonTravel",
    _type: "json",
    keyword: name,
    areaCode: GANGWON_AREA_CODE,
    contentTypeId: "39", // 음식점
    numOfRows: "3",
    pageNo: "1",
    arrange: "A",
  });

  try {
    const res = await fetch(`${BASE_URL}?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const body = data?.response?.body;
    if (!body || body.totalCount === 0) return null;

    const items = body.items?.item;
    if (!items) return null;
    const itemList = Array.isArray(items) ? items : [items];

    for (const item of itemList) {
      if (item.firstimage && item.firstimage.trim() !== "") {
        return {
          imageUrl: item.firstimage.replace(/^http:\/\//, "https://"),
          title: item.title,
        };
      }
    }
    return null;
  } catch (err) {
    return null;
  }
}

function loadAllRestaurants() {
  const restaurants = [];
  const files = fs.readdirSync(DATA_DIR).filter(
    (f) => f.endsWith(".js") && f !== "index.js"
  );

  for (const file of files) {
    const content = fs.readFileSync(path.join(DATA_DIR, file), "utf-8");
    const nameRegex = /name:\s*"([^"]+)"/g;
    let match;
    while ((match = nameRegex.exec(content)) !== null) {
      restaurants.push({ name: match[1], file });
    }
  }
  return restaurants;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const serviceKey = loadEnv();

  console.log("===========================================");
  console.log("  Tour API 맛집 이미지 수집 스크립트");
  console.log("===========================================\n");

  let results = {};
  if (fs.existsSync(OUTPUT_PATH)) {
    try {
      results = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
      console.log(`기존 결과 파일 로드: ${Object.keys(results).length}개 항목\n`);
    } catch { results = {}; }
  }

  const restaurants = loadAllRestaurants();
  console.log(`총 ${restaurants.length}개 맛집 발견\n`);

  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;

  for (let i = 0; i < restaurants.length; i++) {
    const r = restaurants[i];
    const progress = `[${i + 1}/${restaurants.length}]`;

    if (results[r.name]) { skipCount++; continue; }

    const result = await searchRestaurantImage(serviceKey, r.name);

    if (result && result.imageUrl) {
      results[r.name] = result.imageUrl;
      successCount++;
      console.log(`${progress} OK    ${r.name}`);
    } else {
      failCount++;
    }

    if ((i + 1) % 20 === 0) {
      fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2), "utf-8");
    }

    await delay(200);
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2), "utf-8");

  console.log("\n===========================================");
  console.log("  수집 완료!");
  console.log(`  성공: ${successCount}개 / 실패: ${failCount}개 / 스킵: ${skipCount}개`);
  console.log(`  총 저장: ${Object.keys(results).length}개`);
}

main().catch((err) => { console.error("오류:", err); process.exit(1); });
