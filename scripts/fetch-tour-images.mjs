/**
 * 한국관광공사 Tour API로 강원도 관광지 대표 이미지를 수집하는 스크립트
 *
 * 사전 준비:
 *   1. https://www.data.go.kr 에서 "한국관광공사_국문 관광정보 서비스_GW" 활용 신청
 *   2. 발급받은 인코딩 키를 .env.local 에 추가:
 *      VITE_TOUR_API_KEY=발급받은키
 *
 * 실행:
 *   node scripts/fetch-tour-images.mjs
 *
 * Tour API 4.0 (KorService1) - searchKeyword1 엔드포인트 사용
 * 강원도 areaCode: 32
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "src", "data", "spots");
const OUTPUT_PATH = path.join(__dirname, "..", "src", "data", "spotImageUrls.json");

// ===== .env.local 에서 API 키 읽기 =====
function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("ERROR: .env.local 파일이 없습니다.");
    console.error("  .env.local 에 TOUR_API_KEY=발급받은키 를 추가하세요.");
    process.exit(1);
  }

  const content = fs.readFileSync(envPath, "utf-8");
  const match = content.match(/TOUR_API_KEY=(.+)/);
  if (!match || !match[1].trim()) {
    console.error("ERROR: .env.local 에 TOUR_API_KEY 가 없습니다.");
    console.error("  TOUR_API_KEY=발급받은키 를 추가하세요.");
    process.exit(1);
  }

  return match[1].trim();
}

// ===== Tour API searchKeyword1 호출 =====
const BASE_URL = "https://apis.data.go.kr/B551011/KorService2/searchKeyword2";
const GANGWON_AREA_CODE = "32"; // 강원특별자치도

async function searchSpotImage(serviceKey, spotName, region) {
  // 장소명을 키워드로 검색 (강원도 지역 제한)
  const params = new URLSearchParams({
    serviceKey,                  // 인증키 (디코딩 키 사용 시 자동 인코딩됨)
    MobileOS: "ETC",
    MobileApp: "GangwonTravel",
    _type: "json",
    keyword: spotName,
    areaCode: GANGWON_AREA_CODE,
    numOfRows: "3",              // 상위 3건만 조회
    pageNo: "1",
    arrange: "A",                // 제목순 정렬
  });

  const url = `${BASE_URL}?${params.toString()}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    // 응답 구조: response.body.items.item (배열 또는 단일 객체)
    const body = data?.response?.body;
    if (!body || body.totalCount === 0) {
      return null;
    }

    const items = body.items?.item;
    if (!items) return null;

    // item이 단일 객체일 수도, 배열일 수도 있음
    const itemList = Array.isArray(items) ? items : [items];

    // firstimage가 있는 첫 번째 항목 찾기
    for (const item of itemList) {
      if (item.firstimage && item.firstimage.trim() !== "") {
        return {
          imageUrl: item.firstimage,
          imageUrl2: item.firstimage2 || null,
          title: item.title,
          contentId: item.contentid,
        };
      }
    }

    return null;
  } catch (err) {
    // 네트워크 에러 등은 조용히 넘기고 null 반환
    console.error(`    API 호출 실패 (${spotName}): ${err.message}`);
    return null;
  }
}

// ===== 모든 spot 데이터 파일에서 장소 목록 추출 =====
function loadAllSpots() {
  const spots = [];

  const files = fs.readdirSync(DATA_DIR).filter(
    (f) => f.endsWith(".js") && f !== "index.js"
  );

  for (const file of files) {
    const content = fs.readFileSync(path.join(DATA_DIR, file), "utf-8");

    // name: "..." 과 region: "..." 파싱
    const nameRegex = /name:\s*"([^"]+)"/g;
    const regionRegex = /region:\s*"([^"]+)"/g;

    const names = [];
    const regions = [];
    let match;

    while ((match = nameRegex.exec(content)) !== null) {
      names.push(match[1]);
    }
    while ((match = regionRegex.exec(content)) !== null) {
      regions.push(match[1]);
    }

    for (let i = 0; i < names.length; i++) {
      spots.push({
        name: names[i],
        region: regions[i] || "",
        file,
      });
    }
  }

  return spots;
}

// ===== 딜레이 유틸 =====
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ===== 메인 =====
async function main() {
  const serviceKey = loadEnv();

  console.log("===========================================");
  console.log("  Tour API 관광지 이미지 수집 스크립트");
  console.log("===========================================\n");

  // 기존 결과 파일이 있으면 불러와서 이어서 진행
  let results = {};
  if (fs.existsSync(OUTPUT_PATH)) {
    try {
      results = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
      console.log(`기존 결과 파일 로드: ${Object.keys(results).length}개 항목\n`);
    } catch {
      results = {};
    }
  }

  const spots = loadAllSpots();
  console.log(`총 ${spots.length}개 관광지 발견\n`);

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < spots.length; i++) {
    const spot = spots[i];
    const progress = `[${i + 1}/${spots.length}]`;

    // 이미 수집된 항목은 건너뛰기
    if (results[spot.name]) {
      skipCount++;
      console.log(`${progress} SKIP  ${spot.name} (이미 수집됨)`);
      continue;
    }

    // API 호출
    const result = await searchSpotImage(serviceKey, spot.name, spot.region);

    if (result && result.imageUrl) {
      results[spot.name] = result.imageUrl;
      successCount++;
      console.log(`${progress} OK    ${spot.name}`);
      console.log(`         -> ${result.imageUrl.substring(0, 80)}...`);
      if (result.title !== spot.name) {
        console.log(`         (매칭: "${result.title}")`);
      }
    } else {
      failCount++;
      console.log(`${progress} MISS  ${spot.name} (이미지 없음)`);
    }

    // 중간 저장 (10개마다)
    if ((i + 1) % 10 === 0) {
      fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2), "utf-8");
      console.log(`\n  -- 중간 저장 완료 (${Object.keys(results).length}개) --\n`);
    }

    // Rate limiting: 300ms 딜레이
    await delay(300);
  }

  // 최종 저장
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2), "utf-8");

  console.log("\n===========================================");
  console.log("  수집 완료!");
  console.log("===========================================");
  console.log(`  성공: ${successCount}개`);
  console.log(`  실패: ${failCount}개`);
  console.log(`  스킵: ${skipCount}개 (이전 수집분)`);
  console.log(`  총 저장: ${Object.keys(results).length}개`);
  console.log(`\n  결과 파일: ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error("스크립트 실행 중 오류:", err);
  process.exit(1);
});
