/**
 * 18개 지역별 대표 음식 데이터
 * category: "식사" | "간식/카페"
 * restaurants: 추천 맛집 2-3곳 (나중에 광고 연동 가능)
 */
export const REGIONAL_FOODS = {
  "춘천시": [
    {
      id: "chuncheon-dakgalbi",
      name: "춘천 닭갈비",
      emoji: "🍗",
      category: "식사",
      description: "숯불에 구운 매콤한 철판 닭갈비, 춘천의 대표 음식",
      restaurants: [
        { name: "춘천명동닭갈비", priceRange: "1만~2만원" },
        { name: "온의닭갈비", priceRange: "1만~2만원" },
      ],
    },
    {
      id: "chuncheon-makguksu",
      name: "춘천 막국수",
      emoji: "🍜",
      category: "식사",
      description: "메밀로 만든 시원한 들기름 막국수, 춘천 3대 음식",
      restaurants: [
        { name: "삼대막국수", priceRange: "8,000~12,000원" },
        { name: "샘밭막국수", priceRange: "8,000~10,000원" },
      ],
    },
    {
      id: "chuncheon-gamja",
      name: "감자옹심이",
      emoji: "🥟",
      category: "식사",
      description: "강원도 감자로 빚은 쫄깃한 옹심이, 향토 별미",
      restaurants: [
        { name: "부안감자옹심이", priceRange: "8,000~11,000원" },
      ],
    },
    {
      id: "chuncheon-cafe",
      name: "호반 카페",
      emoji: "☕",
      category: "간식/카페",
      description: "의암호, 소양강 뷰가 아름다운 감성 카페",
      restaurants: [
        { name: "쉬즈베이커리", priceRange: "5,000~8,000원" },
        { name: "레터링", priceRange: "6,000~10,000원" },
      ],
    },
  ],

  "속초시": [
    {
      id: "sokcho-dakgangjung",
      name: "속초 닭강정",
      emoji: "🍗",
      category: "식사",
      description: "바삭한 튀김에 달콤매콤 양념, 중앙시장 원조 맛",
      restaurants: [
        { name: "만석닭강정", priceRange: "1만~2만원" },
      ],
    },
    {
      id: "sokcho-mulhoe",
      name: "속초 물회",
      emoji: "🐟",
      category: "식사",
      description: "싱싱한 활어에 새콤달콤 육수, 동해안 별미",
      restaurants: [
        { name: "청초수물회", priceRange: "1만~2만원" },
        { name: "봉포머구리집", priceRange: "1만~2만원" },
      ],
    },
    {
      id: "sokcho-sundae",
      name: "아바이순대",
      emoji: "🥟",
      category: "식사",
      description: "실향민이 전해준 함경도식 대왕 순대",
      restaurants: [
        { name: "속초아바이순대", priceRange: "1만~2만원" },
      ],
    },
    {
      id: "sokcho-jjamppong",
      name: "해물짬뽕",
      emoji: "🍜",
      category: "식사",
      description: "동해 해산물이 가득 들어간 얼큰한 짬뽕",
      restaurants: [
        { name: "속초해물짬뽕", priceRange: "8,000~15,000원" },
      ],
    },
    {
      id: "sokcho-cafe",
      name: "바다 카페",
      emoji: "☕",
      category: "간식/카페",
      description: "설악산과 동해가 보이는 오션뷰 카페",
      restaurants: [
        { name: "카페 설악", priceRange: "5,000~8,000원" },
        { name: "파도베이커리", priceRange: "4,000~8,000원" },
      ],
    },
  ],

  "강릉시": [
    {
      id: "gangneung-sundubu",
      name: "초당순두부",
      emoji: "🍲",
      category: "식사",
      description: "바닷물로 만든 부드러운 순두부, 강릉의 대표 음식",
      restaurants: [
        { name: "초당순두부마을", priceRange: "9,000~13,000원" },
      ],
    },
    {
      id: "gangneung-mulhoe",
      name: "강릉 물회",
      emoji: "🐟",
      category: "식사",
      description: "싱싱한 활어에 시원한 육수, 동해안 별미",
      restaurants: [
        { name: "영진횟집", priceRange: "1만~2만원" },
        { name: "해람꼬막", priceRange: "1만~2만원" },
      ],
    },
    {
      id: "gangneung-makguksu",
      name: "강릉 막국수",
      emoji: "🍜",
      category: "식사",
      description: "동치미 육수에 메밀면을 말아낸 시원한 한 그릇",
      restaurants: [
        { name: "남항진막국수", priceRange: "8,000~11,000원" },
      ],
    },
    {
      id: "gangneung-dakgangjung",
      name: "강릉 닭강정",
      emoji: "🍗",
      category: "식사",
      description: "바삭하고 달콤한 양념이 일품인 강릉식 닭강정",
      restaurants: [
        { name: "강릉닭강정본점", priceRange: "1만~2만원" },
      ],
    },
    {
      id: "gangneung-coffee",
      name: "강릉 커피",
      emoji: "☕",
      category: "간식/카페",
      description: "커피 도시 강릉의 로스터리 카페와 안목 커피거리",
      restaurants: [
        { name: "테라로사 커피공장", priceRange: "5,000~8,000원" },
      ],
    },
  ],

  "동해시": [
    {
      id: "donghae-hoe",
      name: "묵호항 횟감",
      emoji: "🐟",
      category: "식사",
      description: "묵호항에서 갓 잡아 올린 싱싱한 모둠회",
      restaurants: [
        { name: "묵호등대횟집", priceRange: "3만~6만원" },
      ],
    },
    {
      id: "donghae-gomchiguk",
      name: "곰치국",
      emoji: "🍲",
      category: "식사",
      description: "동해안 별미, 담백하고 시원한 곰치 맑은국",
      restaurants: [
        { name: "천곡곰치국", priceRange: "9,000~13,000원" },
      ],
    },
    {
      id: "donghae-kalguksu",
      name: "바지락 칼국수",
      emoji: "🍜",
      category: "식사",
      description: "통통한 바지락이 가득한 시원한 칼국수",
      restaurants: [
        { name: "동해장칼국수", priceRange: "7,000~9,000원" },
      ],
    },
    {
      id: "donghae-gukbap",
      name: "북평 국밥",
      emoji: "🍚",
      category: "식사",
      description: "얼큰한 소머리 국밥, 북평 5일장의 맛",
      restaurants: [
        { name: "북평장터국밥", priceRange: "8,000~11,000원" },
      ],
    },
  ],

  "태백시": [
    {
      id: "taebaek-hanwoo",
      name: "태백 한우",
      emoji: "🥩",
      category: "식사",
      description: "고원의 맑은 공기에서 자란 프리미엄 한우",
      restaurants: [
        { name: "태백한우촌", priceRange: "2만~5만원" },
        { name: "고원식당", priceRange: "1만~2만원" },
      ],
    },
    {
      id: "taebaek-gamja",
      name: "감자옹심이",
      emoji: "🥟",
      category: "식사",
      description: "해발 700m 고원 감자로 만든 쫄깃한 옹심이",
      restaurants: [
        { name: "태백원조감자옹심이", priceRange: "8,000~11,000원" },
      ],
    },
    {
      id: "taebaek-dak",
      name: "닭한마리 칼국수",
      emoji: "🍗",
      category: "식사",
      description: "통닭 한 마리를 넣고 끓인 얼큰한 칼국수",
      restaurants: [
        { name: "연화식당", priceRange: "1만~2만원" },
      ],
    },
    {
      id: "taebaek-memil",
      name: "메밀전병",
      emoji: "🍜",
      category: "식사",
      description: "메밀가루로 부친 전병에 김치를 싸먹는 별미",
      restaurants: [
        { name: "산골묵집", priceRange: "7,000~12,000원" },
      ],
    },
  ],

  "삼척시": [
    {
      id: "samcheok-mulhoe",
      name: "삼척 물회",
      emoji: "🐟",
      category: "식사",
      description: "장호항 싱싱한 활어로 만든 시원한 물회",
      restaurants: [
        { name: "삼척항물회명가", priceRange: "15,000~22,000원" },
        { name: "쏠비치횟집", priceRange: "3만~5만원" },
      ],
    },
    {
      id: "samcheok-gomchiguk",
      name: "곰치국",
      emoji: "🍲",
      category: "식사",
      description: "동해바다 곰치로 끓인 시원 담백한 국",
      restaurants: [
        { name: "동해바다곰치국", priceRange: "10,000~13,000원" },
      ],
    },
    {
      id: "samcheok-jogae",
      name: "조개구이",
      emoji: "🦪",
      category: "식사",
      description: "동해안 모듬 조개를 불판에 구워 먹는 해산물 별미",
      restaurants: [
        { name: "맹방해변조개구이", priceRange: "35,000~50,000원" },
      ],
    },
    {
      id: "samcheok-kalguksu",
      name: "해물 칼국수",
      emoji: "🍜",
      category: "식사",
      description: "장호항 해산물이 가득한 시원한 칼국수",
      restaurants: [
        { name: "장호항해물칼국수", priceRange: "9,000~12,000원" },
      ],
    },
  ],

  "양양군": [
    {
      id: "yangyang-songi",
      name: "양양 송이버섯",
      emoji: "🍄",
      category: "식사",
      description: "가을 명품 식재료, 향긋한 송이버섯 전골",
      restaurants: [
        { name: "양양송이마을", priceRange: "3만~6만원" },
      ],
    },
    {
      id: "yangyang-hoe",
      name: "자연산 회",
      emoji: "🐟",
      category: "식사",
      description: "하조대 앞바다에서 건져 올린 싱싱한 자연산 횟감",
      restaurants: [
        { name: "하조대횟집", priceRange: "3만~5.5만원" },
      ],
    },
    {
      id: "yangyang-makguksu",
      name: "양양 막국수",
      emoji: "🍜",
      category: "식사",
      description: "메밀로 만든 시원한 물막국수, 양양 향토 음식",
      restaurants: [
        { name: "남대천메밀막국수", priceRange: "7,000~10,000원" },
      ],
    },
    {
      id: "yangyang-kalguksu",
      name: "해물 칼국수",
      emoji: "🍲",
      category: "식사",
      description: "낙산 해변가에서 먹는 시원한 해물 칼국수",
      restaurants: [
        { name: "낙산해물칼국수", priceRange: "9,000~13,000원" },
      ],
    },
    {
      id: "yangyang-sanche",
      name: "산채 비빔밥",
      emoji: "🌿",
      category: "식사",
      description: "설악산 자락에서 캔 제철 나물로 만든 비빔밥",
      restaurants: [
        { name: "설악산산채밥상", priceRange: "10,000~15,000원" },
      ],
    },
  ],

  "고성군": [
    {
      id: "goseong-daege",
      name: "고성 대게",
      emoji: "🦀",
      category: "식사",
      description: "거진항 명물, 살이 꽉 찬 동해안 대게찜",
      restaurants: [
        { name: "거진대게명가", priceRange: "4만~8만원" },
      ],
    },
    {
      id: "goseong-hoe",
      name: "고성 모둠회",
      emoji: "🐟",
      category: "식사",
      description: "아야진항 갓 잡아올린 싱싱한 자연산 모둠회",
      restaurants: [
        { name: "아야진항수산", priceRange: "3만~6만원" },
        { name: "송지호해변횟집", priceRange: "15,000~25,000원" },
      ],
    },
    {
      id: "goseong-makguksu",
      name: "메밀전병·막국수",
      emoji: "🍜",
      category: "식사",
      description: "통일전망대 가는 길에 먹는 메밀 향토 음식",
      restaurants: [
        { name: "통일전망대메밀촌", priceRange: "8,000~12,000원" },
      ],
    },
    {
      id: "goseong-mandu",
      name: "간성 손만두",
      emoji: "🥟",
      category: "식사",
      description: "간성읍 50년 전통의 손으로 빚은 만두국",
      restaurants: [
        { name: "간성손만두국", priceRange: "7,000~10,000원" },
      ],
    },
  ],

  "영월군": [
    {
      id: "yeongwol-gondre",
      name: "곤드레밥",
      emoji: "🍚",
      category: "식사",
      description: "강원도 산나물 곤드레로 지은 향긋한 솥밥",
      restaurants: [
        { name: "영월곤드레밥집", priceRange: "9,000~12,000원" },
      ],
    },
    {
      id: "yeongwol-makguksu",
      name: "영월 막국수",
      emoji: "🍜",
      category: "식사",
      description: "메밀막국수에 수육을 곁들인 영월식 한상",
      restaurants: [
        { name: "청령포막국수", priceRange: "9,000~20,000원" },
      ],
    },
    {
      id: "yeongwol-sundubu",
      name: "영월 순두부",
      emoji: "🍲",
      category: "식사",
      description: "동강 맑은 물로 만든 부드러운 순두부 백반",
      restaurants: [
        { name: "동강할매순두부", priceRange: "8,000~10,000원" },
      ],
    },
    {
      id: "yeongwol-sanche",
      name: "산채 한정식",
      emoji: "🌿",
      category: "식사",
      description: "별마로 자락에서 캔 산나물 가득한 한정식",
      restaurants: [
        { name: "별마로한정식", priceRange: "15,000~25,000원" },
      ],
    },
  ],

  "철원군": [
    {
      id: "cheorwon-sundubu",
      name: "민통선 순두부",
      emoji: "🍲",
      category: "식사",
      description: "청정 민통선 콩으로 만든 부드러운 순두부찌개",
      restaurants: [
        { name: "민통선순두부", priceRange: "8,000~12,000원" },
      ],
    },
    {
      id: "cheorwon-makguksu",
      name: "철원 막국수",
      emoji: "🍜",
      category: "식사",
      description: "고석정 앞에서 즐기는 메밀 막국수",
      restaurants: [
        { name: "고석정막국수", priceRange: "7,000~10,000원" },
      ],
    },
    {
      id: "cheorwon-galbi",
      name: "철원 한우 갈비",
      emoji: "🥩",
      category: "식사",
      description: "오대쌀 고장 철원의 숯불 한우 갈비",
      restaurants: [
        { name: "철원숯불갈비", priceRange: "25,000~45,000원" },
      ],
    },
    {
      id: "cheorwon-odaesal",
      name: "오대쌀 정식",
      emoji: "🍚",
      category: "식사",
      description: "전국 최고 품질의 철원 오대쌀로 지은 밥 정식",
      restaurants: [
        { name: "철원두루미식당", priceRange: "10,000~15,000원" },
      ],
    },
  ],

  "홍천군": [
    {
      id: "hongcheon-hanwoo",
      name: "홍천 한우",
      emoji: "🥩",
      category: "식사",
      description: "전국 최대 한우 산지, 프리미엄 한우 등심 구이",
      restaurants: [
        { name: "홍천한우명가", priceRange: "35,000~60,000원" },
        { name: "대명한우촌", priceRange: "40,000~70,000원" },
      ],
    },
    {
      id: "hongcheon-memil",
      name: "홍천 메밀국수",
      emoji: "🍜",
      category: "식사",
      description: "내면 메밀꽃밭에서 자란 메밀로 만든 향토 국수",
      restaurants: [
        { name: "홍천막국수본점", priceRange: "8,000~10,000원" },
        { name: "내면메밀촌", priceRange: "8,000~12,000원" },
      ],
    },
    {
      id: "hongcheon-sanche",
      name: "산채 비빔밥",
      emoji: "🌿",
      category: "식사",
      description: "삼봉산에서 캔 산나물로 만든 건강한 비빔밥",
      restaurants: [
        { name: "삼봉산장", priceRange: "10,000~15,000원" },
      ],
    },
    {
      id: "hongcheon-deodeok",
      name: "더덕 구이 정식",
      emoji: "🥗",
      category: "식사",
      description: "수타사 계곡에서 즐기는 향긋한 더덕 구이",
      restaurants: [
        { name: "수타사골식당", priceRange: "13,000~18,000원" },
      ],
    },
  ],

  "평창군": [
    {
      id: "pyeongchang-memil",
      name: "봉평 메밀 음식",
      emoji: "🍜",
      category: "식사",
      description: "이효석 소설 '메밀꽃 필 무렵'의 고장, 메밀 전병과 국수",
      restaurants: [
        { name: "효석문화마을메밀꽃식당", priceRange: "9,000~13,000원" },
        { name: "봉평메밀촌", priceRange: "8,000~12,000원" },
      ],
    },
    {
      id: "pyeongchang-hanwoo",
      name: "대관령 한우",
      emoji: "🥩",
      category: "식사",
      description: "대관령 고원에서 자란 명품 한우 등심",
      restaurants: [
        { name: "대관령한우타운", priceRange: "35,000~55,000원" },
      ],
    },
    {
      id: "pyeongchang-hwangtae",
      name: "황태 해장국",
      emoji: "🐟",
      category: "식사",
      description: "대관령 황태덕장에서 말린 황태로 끓인 시원한 국",
      restaurants: [
        { name: "황태덕장식당", priceRange: "9,000~15,000원" },
      ],
    },
    {
      id: "pyeongchang-yanggalbi",
      name: "양갈비 구이",
      emoji: "🍖",
      category: "식사",
      description: "양떼목장 옆에서 즐기는 특별한 양갈비",
      restaurants: [
        { name: "대관령양떼목장식당", priceRange: "18,000~30,000원" },
      ],
    },
  ],

  "인제군": [
    {
      id: "inje-hwangtae",
      name: "용대리 황태",
      emoji: "🐟",
      category: "식사",
      description: "겨울 바람에 말린 진짜 황태, 구이와 해장국",
      restaurants: [
        { name: "인제황태마을식당", priceRange: "12,000~18,000원" },
        { name: "용대리황태해장국", priceRange: "9,000~12,000원" },
      ],
    },
    {
      id: "inje-sanche",
      name: "산채 정식",
      emoji: "🌿",
      category: "식사",
      description: "내설악에서 캔 제철 산나물 가득한 정식",
      restaurants: [
        { name: "만해마을산채정식", priceRange: "13,000~18,000원" },
      ],
    },
    {
      id: "inje-songeo",
      name: "내린천 송어",
      emoji: "🐟",
      category: "식사",
      description: "맑은 내린천에서 잡은 송어로 만든 회",
      restaurants: [
        { name: "내린천송어횟집", priceRange: "20,000~35,000원" },
      ],
    },
    {
      id: "inje-hanwoo",
      name: "인제 한우",
      emoji: "🥩",
      category: "식사",
      description: "청정 자연에서 키운 인제 한우 모둠 구이",
      restaurants: [
        { name: "인제한우명가", priceRange: "35,000~60,000원" },
      ],
    },
  ],

  "양구군": [
    {
      id: "yanggu-gomchwi",
      name: "양구 곰취쌈밥",
      emoji: "🌿",
      category: "식사",
      description: "양구 특산물 곰취로 감싸 먹는 건강한 쌈밥 정식",
      restaurants: [
        { name: "양구곰취마을식당", priceRange: "11,000~15,000원" },
      ],
    },
    {
      id: "yanggu-siraegi",
      name: "시래기 된장밥",
      emoji: "🥬",
      category: "식사",
      description: "구수한 된장에 시래기를 넣어 지은 시골밥",
      restaurants: [
        { name: "시래기밥상", priceRange: "8,000~11,000원" },
      ],
    },
    {
      id: "yanggu-makguksu",
      name: "펀치볼 막국수",
      emoji: "🍜",
      category: "식사",
      description: "해안분지(펀치볼)에서 즐기는 들깨 막국수",
      restaurants: [
        { name: "펀치볼막국수", priceRange: "7,000~10,000원" },
      ],
    },
    {
      id: "yanggu-dak",
      name: "산골 닭한마리",
      emoji: "🍗",
      category: "식사",
      description: "양구 산골에서 키운 토종닭 한마리 전골",
      restaurants: [
        { name: "양구산골닭한마리", priceRange: "13,000~20,000원" },
      ],
    },
  ],

  "횡성군": [
    {
      id: "hoengseong-hanwoo",
      name: "횡성 한우",
      emoji: "🥩",
      category: "식사",
      description: "전국 최고급 횡성 한우, 꽃등심·채끝살 구이",
      restaurants: [
        { name: "횡성한우프라자", priceRange: "40,000~65,000원" },
        { name: "더한우횡성", priceRange: "35,000~55,000원" },
        { name: "한우마을식당", priceRange: "10,000~15,000원" },
      ],
    },
    {
      id: "hoengseong-jjinbbang",
      name: "안흥 찐빵",
      emoji: "🥟",
      category: "간식/카페",
      description: "안흥면 명물, 팥소가 꽉 찬 따끈한 찐빵",
      restaurants: [
        { name: "안흥찐빵마을", priceRange: "2,000~8,000원" },
      ],
    },
    {
      id: "hoengseong-makguksu",
      name: "둔내 막국수",
      emoji: "🍜",
      category: "식사",
      description: "둔내면의 들기름 막국수, 고소하고 시원한 맛",
      restaurants: [
        { name: "둔내막국수", priceRange: "8,000~10,000원" },
      ],
    },
    {
      id: "hoengseong-sanche",
      name: "산채 정식",
      emoji: "🌿",
      category: "식사",
      description: "태기산에서 캔 제철 산나물 가득한 정식",
      restaurants: [
        { name: "태기산산채정식", priceRange: "12,000~18,000원" },
      ],
    },
  ],

  "정선군": [
    {
      id: "jeongseon-gondre",
      name: "정선 곤드레 솥밥",
      emoji: "🍚",
      category: "식사",
      description: "정선 곤드레로 지은 향긋한 솥밥에 된장찌개",
      restaurants: [
        { name: "정선곤드레밥상", priceRange: "9,000~12,000원" },
      ],
    },
    {
      id: "jeongseon-makguksu",
      name: "정선 막국수",
      emoji: "🍜",
      category: "식사",
      description: "아우라지 강변에서 먹는 메밀막국수와 감자전",
      restaurants: [
        { name: "아우라지할매국수", priceRange: "8,000~10,000원" },
      ],
    },
    {
      id: "jeongseon-gamja",
      name: "감자옹심이 칼국수",
      emoji: "🥟",
      category: "식사",
      description: "정선 감자로 빚은 옹심이가 들어간 칼국수",
      restaurants: [
        { name: "정선아리랑칼국수", priceRange: "9,000~11,000원" },
      ],
    },
    {
      id: "jeongseon-sanche",
      name: "산채 비빔밥",
      emoji: "🌿",
      category: "식사",
      description: "민둥산 자락에서 캔 산나물 비빔밥과 더덕구이",
      restaurants: [
        { name: "민둥산산채비빔밥", priceRange: "10,000~16,000원" },
      ],
    },
  ],

  "화천군": [
    {
      id: "hwacheon-sancheoneo",
      name: "산천어 회·튀김",
      emoji: "🐟",
      category: "식사",
      description: "겨울 축제의 주인공, 갓 잡은 산천어 회와 튀김",
      restaurants: [
        { name: "화천산천어마을식당", priceRange: "12,000~20,000원" },
      ],
    },
    {
      id: "hwacheon-maeuntang",
      name: "파로호 민물매운탕",
      emoji: "🍲",
      category: "식사",
      description: "파로호에서 잡은 민물고기로 끓인 얼큰한 매운탕",
      restaurants: [
        { name: "파로호가든", priceRange: "15,000~30,000원" },
      ],
    },
    {
      id: "hwacheon-dakgalbi",
      name: "화천 숯불닭갈비",
      emoji: "🍗",
      category: "식사",
      description: "화천 특산 숯불에 구운 매콤한 닭갈비",
      restaurants: [
        { name: "화천숯불닭갈비", priceRange: "12,000~16,000원" },
      ],
    },
    {
      id: "hwacheon-sanche",
      name: "산채 정식",
      emoji: "🌿",
      category: "식사",
      description: "화천 산골에서 캔 산나물로 차린 토속 밥상",
      restaurants: [
        { name: "화천토속촌", priceRange: "11,000~16,000원" },
      ],
    },
  ],

  "원주시": [
    {
      id: "wonju-hanwoo",
      name: "원주 한우",
      emoji: "🥩",
      category: "식사",
      description: "강원도의 관문 원주에서 즐기는 한우 등심 구이",
      restaurants: [
        { name: "원주한우명가", priceRange: "3만~6만원" },
      ],
    },
    {
      id: "wonju-maeuntang",
      name: "황둔 민물회",
      emoji: "🐟",
      category: "식사",
      description: "섬강의 맑은 물에서 잡은 쏘가리 매운탕",
      restaurants: [
        { name: "황둔활어회", priceRange: "2만~4만원" },
      ],
    },
    {
      id: "wonju-ssambap",
      name: "원주 쌈밥",
      emoji: "🥬",
      category: "식사",
      description: "원주 중앙시장 근처 유명 쌈밥거리의 건강한 한상",
      restaurants: [
        { name: "두부마을", priceRange: "8,000~15,000원" },
      ],
    },
    {
      id: "wonju-cafe",
      name: "뮤지엄산 카페",
      emoji: "☕",
      category: "간식/카페",
      description: "뮤지엄산, 소금산 트레킹 후 즐기는 감성 카페",
      restaurants: [
        { name: "카페 봄날", priceRange: "5,000~8,000원" },
      ],
    },
  ],
};
