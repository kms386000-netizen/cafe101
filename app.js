/**
 * Cafe 101 (카페 101) - Main Frontend Application Logic
 * Implements the full 6-step User Flow and Cafe Owner Dashboard
 */

// Application State
const state = {
  cafes: [],
  filteredCafes: [],
  selectedCafe: null,
  activeTag: 'all',
  detailedFilters: {
    brightness: 3,
    noise: 2,
    outlet: 50,
    restroom: 'any'
  },
  onboarding: {
    purposes: ['#카공/업무'],
    lighting: '#어두운조명',
    amenities: ['#콘센트많음', '#쾌적한내부화장실']
  },
  isPremium: false,
  appMode: 'consumer', // 'consumer' | 'owner'
  viewMode: 'split',    // 'split' | 'map' | 'list'
  userPoints: 1200,
  userCoupons: [
    { id: 'CP_WELCOME', title: '신규 가입 환영 아메리카노 1,000원 할인권', expire: '2026.12.31', badge: '가입축하' },
    { id: 'CP_TIME1', title: '[타임딜] 루미에르 가든 디저트 20% 할인 쿠폰', expire: '2026.12.15', badge: '사장님 타임딜' }
  ],
  map: null,
  markers: {},
  reviewForm: {
    rating: 5,
    photos: []
  }
};

// Initial Mock Cafe Data
const INITIAL_CAFES = [
  {
    id: "cafe_1",
    name: "오츠에스프레소 성수점",
    category: "스페셜티 커피 & 아인슈페너",
    area: "서울 성동구 성수동",
    distance: "180m",
    walkTime: "3분",
    lat: 37.5446,
    lng: 127.0560,
    congestion: "chill", // chill, moderate, crowded, full
    congestionLabel: "여유",
    occupancyRate: 38,
    availableSeats: 14,
    totalSeats: 24,
    rating: 4.8,
    trueRating: 4.5,
    reviewCount: 384,
    rawReviewCount: 142,
    tags: ["#카공/업무", "#콘센트많음", "#어두운조명", "#쾌적한내부화장실", "#아인슈페너맛집"],
    atmosphere: "어두운조명",
    brightnessScore: 2,
    noiseLevel: 2,
    outletRatio: 85,
    restroom: "매장 내부 (남녀분리, 쾌적)",
    parking: "인근 유료공영주차장 도보 2분",
    petFriendly: true,
    img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
    description: "묵직하고 크리미한 아인슈페너와 차분하고 짙은 우드톤의 조명. 카공과 독서에 몰입하기 좋은 성수동의 히든 플레이스.",
    signatureMenu: [
      { name: "시그니처 아인슈페너", price: "6,500원", desc: "직접 제조한 쫀득한 수제 생크림과 진한 에스프레소", popular: true },
      { name: "오츠 블렌드 드립커피", price: "6,000원", desc: "다크초콜릿의 단맛과 묵직한 바디감", popular: false },
      { name: "수제 버터 스콘", price: "4,500원", desc: "프랑스산 고메버터로 매일 아침 구워내는 스콘", popular: true }
    ],
    hourlyCongestion: [
      { hour: "09:00", rate: 15 },
      { hour: "11:00", rate: 28 },
      { hour: "13:00", rate: 65 },
      { hour: "15:00", rate: 45 },
      { hour: "17:00", rate: 38 },
      { hour: "19:00", rate: 55 },
      { hour: "21:00", rate: 30 }
    ],
    seats: [
      { id: "S1", type: "창가 1인석", outlet: true, occupied: false },
      { id: "S2", type: "창가 1인석", outlet: true, occupied: false },
      { id: "S3", type: "창가 1인석", outlet: true, occupied: true },
      { id: "S4", type: "2인 테이블", outlet: true, occupied: false },
      { id: "S5", type: "2인 테이블", outlet: false, occupied: true },
      { id: "S6", type: "4인 롱테이블", outlet: true, occupied: false },
      { id: "S7", type: "4인 롱테이블", outlet: true, occupied: false },
      { id: "S8", type: "쇼파석", outlet: false, occupied: true }
    ],
    cleanReviews: [
      { author: "성수러버", rating: 5, date: "2026.11.20", content: "아인슈페너 크림이 예술이에요! 조용해서 책 읽기에도 정말 좋아요.", photos: ["https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=300&q=80"] },
      { author: "커피한잔", rating: 5, date: "2026.11.18", content: "인테리어가 감각적이고 매장 내부 화장실이 호텔처럼 깨끗해서 마음에 듭니다.", photos: [] }
    ],
    rawReviews: [
      { author: "팩트폭격기", rating: 3.8, date: "2026.11.21", content: "커피 맛과 크림은 상위 1% 인정. 근데 주말 오후 2시 넘으면 만석이고 웨이팅 심해서 카공 불가능함. 평일 오전 방문 강력 추천. 창가 3번 좌석은 에어컨 직타석이라 추움.", tags: ["#주말웨이팅극심", "#평일추천", "#커피맛최고", "#3번좌석춥다"] },
      { author: "노트북작업러", rating: 4.5, date: "2026.11.15", content: "콘센트는 넉넉한데 원목 의자가 2시간 넘어가면 엉덩이 아픕니다. 방석 챙겨오시면 최적의 작업 공간임. 화장실 디퓨저 향 좋음.", tags: ["#의자살짝딱딱", "#콘센트굿", "#화장실깔끔"] }
    ]
  },
  {
    id: "cafe_2",
    name: "카페 어반사일런스",
    category: "하이엔드 워크 & 스터디 카페",
    area: "서울 성동구 뚝섬로",
    distance: "250m",
    walkTime: "4분",
    lat: 37.5458,
    lng: 127.0545,
    congestion: "full",
    congestionLabel: "만석",
    occupancyRate: 98,
    availableSeats: 0,
    totalSeats: 35,
    rating: 4.9,
    trueRating: 4.2,
    reviewCount: 512,
    rawReviewCount: 210,
    tags: ["#카공/업무", "#콘센트많음", "#어두운조명", "#쾌적한내부화장실", "#독서실급정숙"],
    atmosphere: "어두운조명",
    brightnessScore: 2,
    noiseLevel: 1,
    outletRatio: 100,
    restroom: "매장 내부 남녀분리 (다이슨 구비)",
    parking: "기계식 주차 2시간 무료",
    petFriendly: false,
    img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
    description: "전 좌석 초고속 기가와이파이 및 듀얼 콘센트 완비. 집중력 극대화되는 핀조명과 백색소음 시스템.",
    signatureMenu: [
      { name: "사일런스 콜드브루", price: "5,500원", desc: "산미 없이 깔끔한 18시간 저온 추출 콜드브루", popular: true },
      { name: "오트 바닐라 라떼", price: "6,500원", desc: "식물성 오틀리 우유와 마다가스카르 바닐라빈", popular: true }
    ],
    hourlyCongestion: [
      { hour: "09:00", rate: 40 },
      { hour: "11:00", rate: 70 },
      { hour: "13:00", rate: 95 },
      { hour: "15:00", rate: 98 },
      { hour: "17:00", rate: 90 },
      { hour: "19:00", rate: 75 },
      { hour: "21:00", rate: 45 }
    ],
    seats: [
      { id: "A1", type: "독서실형 1인석", outlet: true, occupied: true },
      { id: "A2", type: "독서실형 1인석", outlet: true, occupied: true },
      { id: "A3", type: "독서실형 1인석", outlet: true, occupied: true },
      { id: "A4", type: "독서실형 1인석", outlet: true, occupied: true }
    ],
    cleanReviews: [
      { author: "개발자H", rating: 5, date: "2026.11.22", content: "와이파이 속도 미쳤고 소음 관리 너무 잘 됩니다. 집중 끝판왕.", photos: [] }
    ],
    rawReviews: [
      { author: "익명리뷰어", rating: 3.5, date: "2026.11.19", content: "현재 평일 오후에도 자리 잡기 하늘의 별따기입니다. 만석 알림 안보고 갔다가 40분 대기함. 앱 실시간 좌석 꼭 확인하고 오세요. 키보드 타이핑 소리 눈치보일 정도로 조용함.", tags: ["#자리잡기극악", "#키보드눈치", "#완전조용"] }
    ]
  },
  {
    id: "cafe_3",
    name: "루미에르 성수 가든",
    category: "유행 디저트 & 로맨틱 데이트",
    area: "서울 성동구 서울숲길",
    distance: "320m",
    walkTime: "5분",
    lat: 37.5432,
    lng: 127.0532,
    congestion: "moderate",
    congestionLabel: "보통",
    occupancyRate: 65,
    availableSeats: 9,
    totalSeats: 28,
    rating: 4.7,
    trueRating: 4.4,
    reviewCount: 420,
    rawReviewCount: 185,
    tags: ["#데이트", "#유행디저트", "#밝은조명", "#쾌적한내부화장실", "#인스타감성"],
    atmosphere: "밝은조명",
    brightnessScore: 5,
    noiseLevel: 3,
    outletRatio: 30,
    restroom: "매장 내부 남녀분리 (파우더룸 구비)",
    parking: "발렛 파킹 가능 (3천원)",
    petFriendly: true,
    img: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=600&q=80",
    description: "자연 채광 가득한 통창 뷰와 생화 플랜테리어. 두바이 초콜릿 크루키와 생토노레 디저트 맛집.",
    signatureMenu: [
      { name: "두바이 피스타치오 크루키", price: "7,800원", desc: "바삭한 카다이프와 수제 피스타치오 스프레드", popular: true },
      { name: "피치 블라썸 에이드", price: "7,000원", desc: "직접 담근 유기농 백도 복숭아 청과 히비스커스", popular: true }
    ],
    hourlyCongestion: [
      { hour: "11:00", rate: 20 },
      { hour: "13:00", rate: 70 },
      { hour: "15:00", rate: 80 },
      { hour: "17:00", rate: 65 },
      { hour: "19:00", rate: 50 }
    ],
    seats: [
      { id: "G1", type: "테라스 가든석", outlet: false, occupied: false },
      { id: "G2", type: "통창 2인 테이블", outlet: false, occupied: true },
      { id: "G3", type: "원형 쇼파석", outlet: true, occupied: false }
    ],
    cleanReviews: [
      { author: "소담", rating: 5, date: "2026.11.20", content: "데이트하기에 분위기 진짜 최고예요! 디저트 비주얼 사진 대박 잘나와요.", photos: [] }
    ],
    rawReviews: [
      { author: "솔직미식가", rating: 4.1, date: "2026.11.16", content: "크루키는 정말 맛있는데 음료 가격대가 다소 높고, 주말엔 사진 찍는 사람들로 조금 어수선합니다. 콘센트 자리가 거의 없어서 작업 목적으론 비추천, 데이트엔 굿.", tags: ["#콘센트부족", "#데이트강추", "#디저트맛도리", "#가격대높음"] }
    ]
  },
  {
    id: "cafe_4",
    name: "포레스트 라운지 (추천 대체 카페)",
    category: "조용한 로스터리 & 모던 카공",
    area: "서울 성동구 아차산로",
    distance: "220m",
    walkTime: "3분",
    lat: 37.5451,
    lng: 127.0578,
    congestion: "chill",
    congestionLabel: "여유",
    occupancyRate: 25,
    availableSeats: 22,
    totalSeats: 30,
    rating: 4.6,
    trueRating: 4.6,
    reviewCount: 180,
    rawReviewCount: 88,
    tags: ["#카공/업무", "#콘센트많음", "#어두운조명", "#쾌적한내부화장실", "#숨은명소"],
    atmosphere: "어두운조명",
    brightnessScore: 2,
    noiseLevel: 2,
    outletRatio: 90,
    restroom: "매장 내부 남녀분리 (상시 청결 유지)",
    parking: "매장 앞 2대 주차 가능",
    petFriendly: true,
    img: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=80",
    description: "성수의 숨겨진 보석. 넓은 원목 테이블마다 콘센트가 구비되어 있고, 잔잔한 재즈 음악이 흐르는 여유로운 공간.",
    signatureMenu: [
      { name: "싱글오리진 필터 드립", price: "6,000원", desc: "에티오피아 예가체프의 화사한 꽃향기", popular: true },
      { name: "바스크 치즈케이크", price: "6,800원", desc: "끼리 크림치즈로 만든 겉바속촉 치즈케이크", popular: true }
    ],
    hourlyCongestion: [
      { hour: "10:00", rate: 10 },
      { hour: "12:00", rate: 25 },
      { hour: "14:00", rate: 35 },
      { hour: "16:00", rate: 25 },
      { hour: "18:00", rate: 20 }
    ],
    seats: [
      { id: "F1", type: "창가 1인석", outlet: true, occupied: false },
      { id: "F2", type: "1인석", outlet: true, occupied: false },
      { id: "F3", type: "4인 테이블", outlet: true, occupied: false }
    ],
    cleanReviews: [
      { author: "성수방랑자", rating: 5, date: "2026.11.19", content: "근처 카페 다 만석이었는데 카페101 추천으로 찾았어요. 자리 널널하고 커피 존맛탱!", photos: [] }
    ],
    rawReviews: [
      { author: "광고극혐러", rating: 4.7, date: "2026.11.14", content: "골목 안쪽에 있어서 아직 덜 알려져서 진짜 평화로움. 콘센트 자리 널려있고 사장님 친절함. 나만 알고 싶은 아지트.", tags: ["#숨은맛집", "#여유로움", "#콘센트천국"] }
    ]
  }
];

// Initialize on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

async function initApp() {
  // Try fetching from server or fallback to local mock
  try {
    const res = await fetch('/api/cafes');
    if (res.ok) {
      state.cafes = await res.json();
    } else {
      state.cafes = JSON.parse(JSON.stringify(INITIAL_CAFES));
    }
  } catch (err) {
    state.cafes = JSON.parse(JSON.stringify(INITIAL_CAFES));
  }

  state.filteredCafes = [...state.cafes];
  
  // Initialize Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Initialize Leaflet Map
  initLeafletMap();

  // Render Initial View
  renderCafeList();
  updateMapMarkers();
  renderOwnerCoupons();
  updateCouponsModalList();

  // Update Points in UI
  document.getElementById("headerPoints").textContent = `${state.userPoints.toLocaleString()} P`;
}

// ================= STEP 2: LEAFLET MAP INITIALIZATION =================
function initLeafletMap() {
  const mapCenter = [37.5446, 127.0555]; // Seongsu Cafe Street
  state.map = L.map('leafletMap', {
    zoomControl: false
  }).setView(mapCenter, 16);

  // Free OpenStreetMap Tile Layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }).addTo(state.map);

  L.control.zoom({ position: 'bottomleft' }).addTo(state.map);
}

function updateMapMarkers() {
  if (!state.map) return;

  // Clear existing markers
  Object.values(state.markers).forEach(m => state.map.removeLayer(m));
  state.markers = {};

  // Color mapping
  const colorMap = {
    chill: { bg: 'bg-emerald-500', text: 'text-white', ring: 'pulse-marker-chill', border: 'border-emerald-600' },
    moderate: { bg: 'bg-amber-500', text: 'text-white', ring: '', border: 'border-amber-600' },
    crowded: { bg: 'bg-orange-500', text: 'text-white', ring: '', border: 'border-orange-600' },
    full: { bg: 'bg-red-500', text: 'text-white', ring: 'pulse-marker-full', border: 'border-red-600' }
  };

  state.filteredCafes.forEach(cafe => {
    const styling = colorMap[cafe.congestion] || colorMap.moderate;
    const isFull = cafe.congestion === 'full';

    const customIcon = L.divIcon({
      className: 'custom-leaflet-pin',
      html: `
        <div class="custom-map-marker relative px-2.5 py-1 ${styling.bg} ${styling.text} text-[11px] border-2 border-white ${styling.ring}">
          <span class="mr-1">${isFull ? '🔴' : '☕'}</span>
          <span>${cafe.name.split(' ')[0]}</span>
          <span class="ml-1 opacity-90 text-[10px] font-normal">(${cafe.availableSeats}석)</span>
        </div>
      `,
      iconSize: [110, 32],
      iconAnchor: [55, 16]
    });

    const marker = L.marker([cafe.lat, cafe.lng], { icon: customIcon }).addTo(state.map);

    marker.on('click', () => {
      if (isFull) {
        // Trigger Step 2: 만석 시 연관 추천 카페 팝업!
        showFullAlternativePopup(cafe);
      } else {
        openCafeDetail(cafe.id);
      }
    });

    state.markers[cafe.id] = marker;
  });
}

function recenterMap() {
  if (state.map) {
    state.map.setView([37.5446, 127.0555], 16);
  }
}

// ================= STEP 2: CAFE LIST RENDERING =================
function renderCafeList() {
  const container = document.getElementById("cafeCardList");
  const countBadge = document.getElementById("cafeCountBadge");
  countBadge.textContent = state.filteredCafes.length;

  if (state.filteredCafes.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 flex flex-col items-center gap-2">
        <i data-lucide="coffee" class="w-8 h-8 text-slate-300"></i>
        <p class="text-xs">선택하신 조건에 맞는 카페가 없습니다.</p>
        <button onclick="toggleTagFilter('all')" class="text-xs text-amber-600 font-bold underline">필터 초기화</button>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  container.innerHTML = state.filteredCafes.map(cafe => {
    const isFull = cafe.congestion === 'full';
    const congestionBadge = {
      chill: `<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>여유 (${cafe.availableSeats}석 남음)</span>`,
      moderate: `<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>보통 (${cafe.availableSeats}석 남음)</span>`,
      crowded: `<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span>혼잡 (${cafe.availableSeats}석 남음)</span>`,
      full: `<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>만석 (대기 3팀)</span>`
    }[cafe.congestion];

    const currentRating = state.isPremium ? cafe.trueRating : cafe.rating;
    const ratingLabel = state.isPremium ? '진짜 평점' : '일반 평점';

    return `
      <div class="bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex gap-4 group" onclick="handleCardClick('${cafe.id}')">
        
        <!-- Image with live badge -->
        <div class="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
          <img src="${cafe.img}" alt="${cafe.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
          <div class="absolute bottom-1.5 left-1.5 right-1.5">
            ${isFull ? '<span class="block text-center text-[10px] font-bold bg-red-600 text-white rounded-md py-0.5 shadow-sm">만석 연관추천</span>' : ''}
          </div>
        </div>

        <!-- Info -->
        <div class="flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between gap-1 mb-1">
              <span class="text-[11px] text-slate-400 font-medium">${cafe.category}</span>
              ${congestionBadge}
            </div>
            
            <h3 class="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors flex items-center gap-1">
              ${cafe.name}
            </h3>

            <p class="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
              <span>📍 ${cafe.distance} · 도보 ${cafe.walkTime}</span>
              <span>·</span>
              <span class="font-semibold text-amber-700">★ ${currentRating}</span>
              <span class="text-[10px] text-slate-400">(${ratingLabel})</span>
            </p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-1 mt-2">
              ${cafe.tags.slice(0, 3).map(tag => `
                <span class="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium">${tag}</span>
              `).join('')}
            </div>
          </div>

          <!-- Quick Detail CTA -->
          <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
            <span class="text-slate-400">조명: ${cafe.atmosphere} · 콘센트 ${cafe.outletRatio}%</span>
            <span class="font-bold text-amber-600 flex items-center gap-0.5">
              상세보기 <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
            </span>
          </div>
        </div>

      </div>
    `;
  }).join('');

  if (window.lucide) {
    lucide.createIcons();
  }
}

function handleCardClick(cafeId) {
  const cafe = state.cafes.find(c => c.id === cafeId);
  if (!cafe) return;

  if (cafe.congestion === 'full') {
    // If cafe is full, trigger Step 2 Alternative Modal!
    showFullAlternativePopup(cafe);
  } else {
    openCafeDetail(cafeId);
  }
}

// ================= STEP 2: 만석 시 연관 추천 팝업 (Full Alternative) =================
function showFullAlternativePopup(fullCafe) {
  const altCafe = state.cafes.find(c => c.id === "cafe_4") || state.cafes.find(c => c.congestion === 'chill');
  
  const content = document.getElementById("alternativeCafeCardContent");
  content.innerHTML = `
    <div class="flex items-center justify-between">
      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
        AI 매칭 추천: 좌석 여유 🟢
      </span>
      <span class="text-[11px] font-bold text-slate-500">도보 ${altCafe.walkTime} (${altCafe.distance})</span>
    </div>

    <div class="flex gap-3 items-center">
      <img src="${altCafe.img}" alt="${altCafe.name}" class="w-16 h-16 rounded-xl object-cover flex-shrink-0">
      <div>
        <h4 class="font-bold text-slate-900 text-sm">${altCafe.name}</h4>
        <p class="text-xs text-emerald-700 font-extrabold">실시간 여유 ${altCafe.availableSeats}석 이용 가능</p>
        <p class="text-[11px] text-slate-500 mt-0.5">${altCafe.description.substring(0, 32)}...</p>
      </div>
    </div>

    <!-- Match Criteria Comparison -->
    <div class="pt-2 border-t border-emerald-200/60 flex flex-wrap gap-1 text-[10px]">
      <span class="px-1.5 py-0.5 bg-white text-emerald-800 rounded font-bold border border-emerald-200">#콘센트많음 (90%)</span>
      <span class="px-1.5 py-0.5 bg-white text-emerald-800 rounded font-bold border border-emerald-200">#어두운조명 (동일)</span>
      <span class="px-1.5 py-0.5 bg-white text-emerald-800 rounded font-bold border border-emerald-200">#쾌적내부화장실</span>
    </div>
  `;

  document.getElementById("goToAlternativeBtn").setAttribute("onclick", `acceptAlternativeCafe('${altCafe.id}')`);
  document.getElementById("fullAlternativeModal").classList.remove("hidden");
  if (window.lucide) lucide.createIcons();
}

function simulateFullCafePopup() {
  const fullCafe = state.cafes.find(c => c.congestion === 'full') || state.cafes[1];
  showFullAlternativePopup(fullCafe);
}

function closeAlternativeModal() {
  document.getElementById("fullAlternativeModal").classList.add("hidden");
}

function acceptAlternativeCafe(altCafeId) {
  closeAlternativeModal();
  openCafeDetail(altCafeId || "cafe_4");
}

// ================= STEP 3: 초정밀 카테고리 필터링 =================
function toggleTagFilter(tag) {
  state.activeTag = tag;

  // Update chip styles
  document.querySelectorAll('.filter-chip').forEach(btn => {
    if ((tag === 'all' && btn.textContent.trim() === '전체') ||
        (tag !== 'all' && btn.textContent.includes(tag))) {
      btn.className = "filter-chip active-chip px-3 py-1.5 text-xs rounded-xl font-bold transition-all whitespace-nowrap bg-amber-600 text-white shadow-xs";
    } else {
      btn.className = "filter-chip px-3 py-1.5 text-xs rounded-xl font-semibold transition-all whitespace-nowrap bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-800 border border-transparent hover:border-amber-200";
    }
  });

  applyFilters();
}

function applyFilters() {
  let list = [...state.cafes];

  // Tag filter
  if (state.activeTag !== 'all') {
    if (state.activeTag === '#여유좌석') {
      list = list.filter(c => c.congestion === 'chill');
    } else {
      list = list.filter(c => c.tags.includes(state.activeTag));
    }
  }

  // Detailed filters
  if (state.detailedFilters.restroom === 'inside_clean') {
    list = list.filter(c => c.tags.includes('#쾌적한내부화장실'));
  }
  if (state.detailedFilters.outlet > 0) {
    list = list.filter(c => c.outletRatio >= state.detailedFilters.outlet);
  }

  state.filteredCafes = list;
  renderCafeList();
  updateMapMarkers();
}

function openDetailedFilterModal() {
  document.getElementById("detailedFilterModal").classList.remove("hidden");
  if (window.lucide) lucide.createIcons();
}

function closeDetailedFilterModal() {
  document.getElementById("detailedFilterModal").classList.add("hidden");
}

function updateBrightnessLabel(val) {
  const labels = {
    1: "1: 어두운 조명 (무드 핀조명)",
    2: "2: 은은한 웜톤",
    3: "3: 보통 조명",
    4: "4: 밝은 편",
    5: "5: 매우 밝음 (통창 채광)"
  };
  document.getElementById("filterBrightnessText").textContent = labels[val];
  state.detailedFilters.brightness = parseInt(val);
}

function updateNoiseLabel(val) {
  const labels = {
    1: "1: 무소음 (독서실급 정숙)",
    2: "2: 조용한 편 (잔잔한 백색소음)",
    3: "3: 보통 (잔잔한 대화/음악)",
    4: "4: 활기참 (친목/수다)",
    5: "5: 에너지 넘침"
  };
  document.getElementById("filterNoiseText").textContent = labels[val];
  state.detailedFilters.noise = parseInt(val);
}

function updateOutletLabel(val) {
  document.getElementById("filterOutletText").textContent = `${val}% 이상`;
  state.detailedFilters.outlet = parseInt(val);
}

function resetDetailedFilters() {
  document.getElementById("filterBrightnessSlider").value = 3;
  document.getElementById("filterNoiseSlider").value = 2;
  document.getElementById("filterOutletSlider").value = 50;
  document.querySelector('input[name="restroomFilter"][value="any"]').checked = true;
  updateBrightnessLabel(3);
  updateNoiseLabel(2);
  updateOutletLabel(50);
  state.detailedFilters = { brightness: 3, noise: 2, outlet: 50, restroom: 'any' };
}

function applyDetailedFilters() {
  const restroom = document.querySelector('input[name="restroomFilter"]:checked').value;
  state.detailedFilters.restroom = restroom;
  applyFilters();
  closeDetailedFilterModal();
}

// Search handling
function handleSearch(keyword) {
  const q = keyword.toLowerCase().trim();
  if (!q) {
    applyFilters();
    return;
  }
  state.filteredCafes = state.cafes.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.category.toLowerCase().includes(q) ||
    c.tags.some(t => t.toLowerCase().includes(q))
  );
  renderCafeList();
  updateMapMarkers();
}

function changeArea(area) {
  // Center map on area
  const coords = {
    "성수": [37.5446, 127.0555],
    "연남": [37.5620, 126.9240],
    "강남": [37.4979, 127.0276],
    "을지로": [37.5663, 126.9920],
    "신촌": [37.5555, 126.9368]
  };
  if (state.map && coords[area]) {
    state.map.setView(coords[area], 16);
  }
}

// ================= STEP 4: 카페 상세 페이지 & 인터랙티브 좌석 배치도 & 이원화 리뷰 =================
function openCafeDetail(cafeId) {
  const cafe = state.cafes.find(c => c.id === cafeId);
  if (!cafe) return;
  state.selectedCafe = cafe;

  // Header info
  document.getElementById("detailHeroImg").src = cafe.img;
  document.getElementById("detailName").textContent = cafe.name;
  document.getElementById("detailCategory").textContent = cafe.category;
  document.getElementById("detailAddress").innerHTML = `
    <i data-lucide="map-pin" class="w-3 h-3 text-amber-400"></i>
    ${cafe.area} · 도보 ${cafe.walkTime} (${cafe.distance})
  `;

  // Congestion Badge
  const congBadge = document.getElementById("detailCongestionBadge");
  const isFull = cafe.congestion === 'full';
  congBadge.className = `px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-xs ${
    cafe.congestion === 'chill' ? 'bg-emerald-500 text-white' :
    cafe.congestion === 'moderate' ? 'bg-amber-500 text-white' :
    cafe.congestion === 'crowded' ? 'bg-orange-500 text-white' : 'bg-red-500 text-white'
  }`;
  congBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-white animate-ping"></span> ${cafe.congestionLabel} (${cafe.availableSeats}석 남음)`;

  // Atmosphere Specs
  document.getElementById("specLighting").textContent = `${cafe.atmosphere} (${cafe.brightnessScore}/5)`;
  document.getElementById("specNoise").textContent = `소음 수준 (${cafe.noiseLevel}/5)`;
  document.getElementById("specOutlet").textContent = `전 좌석의 ${cafe.outletRatio}%`;
  document.getElementById("specRestroom").textContent = cafe.restroom;

  // Interactive Live Seat Map Grid
  renderSeatMap(cafe);

  // Hourly Congestion Chart
  renderHourlyChart(cafe);

  // Signature Menu List
  renderMenuList(cafe);

  // Reviews
  renderDetailReviews(cafe);

  document.getElementById("cafeDetailModal").classList.remove("hidden");
  if (window.lucide) lucide.createIcons();
}

function closeCafeDetailModal() {
  document.getElementById("cafeDetailModal").classList.add("hidden");
}

function renderSeatMap(cafe) {
  const grid = document.getElementById("seatMapGrid");
  grid.innerHTML = cafe.seats.map(seat => {
    const isOccupied = seat.occupied;
    const bg = isOccupied ? 'bg-slate-200 text-slate-400 border-slate-300' : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 cursor-pointer';
    const statusText = isOccupied ? '이용 중' : '비어있음';

    return `
      <div class="seat-item p-2.5 rounded-xl border flex flex-col justify-between h-16 ${bg}" onclick="alert('${cafe.name} [${seat.id}]\\n유형: ${seat.type}\\n콘센트: ${seat.outlet ? '완비 (2구)' : '없음'}\\n현재 상태: ${statusText}')">
        <div class="flex items-center justify-between text-[10px]">
          <span class="font-bold">${seat.id}</span>
          ${seat.outlet ? '<span class="text-amber-600 font-bold">🔌</span>' : ''}
        </div>
        <div>
          <span class="block text-[11px] font-semibold truncate">${seat.type}</span>
          <span class="text-[9px] font-medium opacity-80">${statusText}</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderHourlyChart(cafe) {
  const container = document.getElementById("hourlyChartContainer");
  const maxRate = 100;

  container.innerHTML = cafe.hourlyCongestion.map(h => {
    const heightPercent = Math.max(15, h.rate);
    const isRush = h.rate >= 70;
    const color = isRush ? 'bg-red-400' : 'bg-amber-400';

    return `
      <div class="flex-1 flex flex-col items-center gap-1 group relative">
        <div class="w-full rounded-t-md ${color} transition-all duration-300 group-hover:bg-amber-600" style="height: ${heightPercent}%;"></div>
        <span class="text-[9px] text-slate-400">${h.hour.split(':')[0]}시</span>
        <!-- Tooltip -->
        <div class="hidden group-hover:block absolute -top-7 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded shadow whitespace-nowrap z-30">
          ${h.hour}: ${h.rate}% 혼잡
        </div>
      </div>
    `;
  }).join('');
}

function renderMenuList(cafe) {
  const container = document.getElementById("detailMenuList");
  container.innerHTML = cafe.signatureMenu.map(item => `
    <div class="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
      <div>
        <div class="flex items-center gap-1.5">
          <span class="font-bold text-slate-800">${item.name}</span>
          ${item.popular ? '<span class="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-bold rounded">BEST</span>' : ''}
        </div>
        <span class="text-[10px] text-slate-400 block mt-0.5">${item.desc}</span>
      </div>
      <span class="font-extrabold text-amber-800 text-xs">${item.price}</span>
    </div>
  `).join('');
}

// Dual Reviews: Clean vs Raw
function renderDetailReviews(cafe) {
  const container = document.getElementById("detailReviewList");
  const upsellBanner = document.getElementById("premiumUpsellBanner");
  const activeNotice = document.getElementById("premiumActiveNotice");
  const badge = document.getElementById("reviewModeBadge");

  if (state.isPremium) {
    // Premium Mode: Show raw unfiltered reviews & unmasked ratings!
    upsellBanner.classList.add("hidden");
    activeNotice.classList.remove("hidden");
    badge.className = "px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800";
    badge.textContent = "🔥 프리미엄 날것의 솔직 리뷰 모드";

    container.innerHTML = cafe.rawReviews.map(r => `
      <div class="p-4 bg-purple-50/40 rounded-2xl border border-purple-200/80 flex flex-col gap-2 text-xs">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="font-bold text-purple-950">${r.author}</span>
            <span class="px-1.5 py-0.2 bg-purple-600 text-white text-[9px] font-bold rounded">날것의 솔직평</span>
            <span class="text-amber-600 font-bold">★ ${r.rating}</span>
          </div>
          <span class="text-[10px] text-slate-400">${r.date}</span>
        </div>
        <p class="text-slate-800 leading-relaxed font-medium">${r.content}</p>
        <div class="flex flex-wrap gap-1 mt-1">
          ${(r.tags || []).map(t => `<span class="px-1.5 py-0.5 bg-white text-purple-800 rounded text-[10px] font-semibold border border-purple-200">${t}</span>`).join('')}
        </div>
      </div>
    `).join('');

  } else {
    // Normal Mode: Show clean friendly reviews
    upsellBanner.classList.remove("hidden");
    activeNotice.classList.add("hidden");
    badge.className = "px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700";
    badge.textContent = "일반 유저 리뷰 모드";

    container.innerHTML = cafe.cleanReviews.map(r => `
      <div class="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col gap-2 text-xs">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="font-bold text-slate-800">${r.author}</span>
            <span class="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">방문인증</span>
            <span class="text-amber-500 font-bold">★ ${r.rating}</span>
          </div>
          <span class="text-[10px] text-slate-400">${r.date}</span>
        </div>
        <p class="text-slate-700 leading-relaxed">${r.content}</p>
        ${r.photos && r.photos.length > 0 ? `
          <div class="flex gap-2 mt-1">
            ${r.photos.map(p => `<img src="${p}" class="w-16 h-16 rounded-xl object-cover border border-slate-200">`).join('')}
          </div>
        ` : ''}
      </div>
    `).join('');
  }
}

// ================= STEP 4: 프리미엄 구독 모달 =================
function openPremiumSubscriptionModal() {
  document.getElementById("premiumSubscriptionModal").classList.remove("hidden");
  if (window.lucide) lucide.createIcons();
}

function closePremiumSubscriptionModal() {
  document.getElementById("premiumSubscriptionModal").classList.add("hidden");
}

function subscribePremiumPlan() {
  state.isPremium = true;
  updatePremiumUI();
  closePremiumSubscriptionModal();
  triggerConfetti();
  alert("🎉 카페 101 프리미엄 구독이 활성화되었습니다!\n광고 제거 & 날것의 진짜 호평/악평이 모두 잠금 해제되었습니다.");
  if (state.selectedCafe) {
    renderDetailReviews(state.selectedCafe);
  }
}

function subscribeFreeTrial() {
  state.isPremium = true;
  updatePremiumUI();
  closePremiumSubscriptionModal();
  if (state.selectedCafe) {
    renderDetailReviews(state.selectedCafe);
  }
}

function togglePremiumStatus() {
  state.isPremium = !state.isPremium;
  updatePremiumUI();
  renderCafeList();
  if (state.selectedCafe) {
    renderDetailReviews(state.selectedCafe);
  }
}

function updatePremiumUI() {
  const btn = document.getElementById("premiumToggleBtn");
  const text = document.getElementById("premiumStatusText");

  if (state.isPremium) {
    btn.className = "px-2.5 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 bg-gradient-to-r from-amber-600 to-purple-600 text-white border-amber-500 shadow-sm";
    text.textContent = "프리미엄: ON 🔥";
  } else {
    btn.className = "px-2.5 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 bg-slate-100 text-slate-600 border-slate-200 hover:border-amber-400";
    text.textContent = "프리미엄: OFF";
  }
}

// ================= STEP 5: 길찾기 & 방문 체크인 =================
function openDirectionsModal() {
  if (!state.selectedCafe) return;
  document.getElementById("dirCafeName").textContent = state.selectedCafe.name;
  document.getElementById("directionsModal").classList.remove("hidden");
  if (window.lucide) lucide.createIcons();
}

function closeDirectionsModal() {
  document.getElementById("directionsModal").classList.add("hidden");
}

function simulateNavApp(appName) {
  alert(`📱 [${appName}] 연동 안내\n목적지: ${state.selectedCafe.name}\n거리: ${state.selectedCafe.distance} (도보 ${state.selectedCafe.walkTime} 소요)\n실시간 길안내를 시작합니다.`);
}

function handleArrivalCheckIn() {
  closeDirectionsModal();
  closeCafeDetailModal();

  // Instant notification
  setTimeout(() => {
    openReviewModal(state.selectedCafe.id);
  }, 400);
}

// ================= STEP 6: 사진 리뷰 작성 & 500P 보상 (Retention) =================
function openReviewModal(cafeId) {
  const cafe = state.cafes.find(c => c.id === cafeId) || state.cafes[0];
  state.selectedCafe = cafe;
  state.reviewForm = { rating: 5, photos: [] };
  setFormRating(5);
  document.getElementById("reviewContentInput").value = "";
  document.getElementById("photoPreview1").innerHTML = `<i data-lucide="plus" class="w-5 h-5 text-slate-400"></i><span class="text-[10px] text-slate-500 mt-1">좌석/콘센트 사진</span>`;
  document.getElementById("photoPreview2").innerHTML = `<i data-lucide="plus" class="w-5 h-5 text-slate-400"></i><span class="text-[10px] text-slate-500 mt-1">메뉴/영수증 사진</span>`;
  document.getElementById("reviewModal").classList.remove("hidden");
  if (window.lucide) lucide.createIcons();
}

function openReviewModalFromDetail() {
  if (state.selectedCafe) {
    openReviewModal(state.selectedCafe.id);
  }
}

function closeReviewModal() {
  document.getElementById("reviewModal").classList.add("hidden");
}

function setFormRating(score) {
  state.reviewForm.rating = score;
  const stars = document.querySelectorAll(".star-btn");
  stars.forEach((s, idx) => {
    s.style.color = idx < score ? '#f59e0b' : '#cbd5e1';
  });
  const labels = {
    1: "1.0점 (매우 아쉬워요)",
    2: "2.0점 (조금 아쉬워요)",
    3: "3.0점 (보통이에요)",
    4: "4.0점 (만족스러워요)",
    5: "5.0점 (최고예요)"
  };
  document.getElementById("starRatingLabel").textContent = labels[score];
}

function selectSamplePhoto(slot) {
  const sampleUrls = [
    "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=80"
  ];
  const url = sampleUrls[slot - 1] || sampleUrls[0];
  state.reviewForm.photos.push(url);

  const preview = document.getElementById(`photoPreview${slot}`);
  preview.innerHTML = `
    <img src="${url}" class="w-full h-full object-cover">
    <span class="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 rounded">첨부됨</span>
  `;
}

async function handleReviewSubmit(e) {
  e.preventDefault();
  const content = document.getElementById("reviewContentInput").value.trim();
  if (!content) {
    alert("솔직한 리뷰 내용을 작성해 주세요.");
    return;
  }

  const selectedTags = Array.from(document.querySelectorAll('input[name="reviewTags"]:checked')).map(el => el.value);

  const newReview = {
    author: "성수탐험가(나)",
    rating: state.reviewForm.rating,
    date: "2026.11.23",
    content: content,
    tags: selectedTags,
    photos: state.reviewForm.photos.length > 0 ? state.reviewForm.photos : ["https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=300&q=80"]
  };

  // Add to cafe reviews in state
  if (state.selectedCafe) {
    state.selectedCafe.rawReviews.unshift(newReview);
    state.selectedCafe.reviewCount += 1;
    state.selectedCafe.rawReviewCount += 1;
  }

  // Award Points & Coupon
  state.userPoints += 500;
  const newCoupon = {
    id: `CP_${Date.now()}`,
    title: `${state.selectedCafe ? state.selectedCafe.name : '카페'} 무료 아메리카노 응모권`,
    expire: "2026.12.31",
    badge: "리뷰 작성 보상"
  };
  state.userCoupons.unshift(newCoupon);

  // Update Server if alive
  try {
    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cafeId: state.selectedCafe ? state.selectedCafe.id : 'cafe_1',
        ...newReview
      })
    });
  } catch (err) {}

  // Update UI
  document.getElementById("headerPoints").textContent = `${state.userPoints.toLocaleString()} P`;
  updateCouponsModalList();
  closeReviewModal();

  // Retention Confetti celebration
  triggerConfetti();

  alert(`🎉 사진 리뷰 등록 완료!\n\n💎 500P 적립 완료 (현재 보유: ${state.userPoints.toLocaleString()}P)\n🎟️ 무료 쿠폰 응모권이 지급되었습니다.\n\n카페 101의 실시간 좌석 및 리뷰 데이터베이스에 기여해 주셔서 감사합니다!`);
  
  if (state.selectedCafe) {
    renderDetailReviews(state.selectedCafe);
  }
  renderCafeList();
}

function triggerConfetti() {
  if (window.confetti) {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

// ================= REWARDS WALLET MODAL =================
function openRewardsModal() {
  document.getElementById("modalPointsBalance").textContent = `${state.userPoints.toLocaleString()} P`;
  updateCouponsModalList();
  document.getElementById("rewardsModal").classList.remove("hidden");
  if (window.lucide) lucide.createIcons();
}

function closeRewardsModal() {
  document.getElementById("rewardsModal").classList.add("hidden");
}

function updateCouponsModalList() {
  const container = document.getElementById("userCouponsList");
  if (!container) return;

  container.innerHTML = state.userCoupons.map(c => `
    <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
      <div>
        <div class="flex items-center gap-1.5">
          <span class="font-bold text-slate-800">${c.title}</span>
          <span class="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-bold rounded">${c.badge}</span>
        </div>
        <span class="text-[10px] text-slate-400 block mt-0.5">유효기간: ~ ${c.expire}</span>
      </div>
      <button onclick="alert('${c.title}\\n매장 방문 시 제시하여 사용 가능합니다.')" class="px-2.5 py-1 bg-amber-600 text-white rounded-lg font-bold text-[11px] shadow-xs">
        사용
      </button>
    </div>
  `).join('');
}

// ================= STEP 1: 맞춤형 온보딩 모달 =================
function openOnboardingModal() {
  document.getElementById("onboardingModal").classList.remove("hidden");
  if (window.lucide) lucide.createIcons();
}

function closeOnboardingModal() {
  document.getElementById("onboardingModal").classList.add("hidden");
}

function toggleOnboardingChoice(btn, category, tag) {
  btn.classList.toggle("active-onboard");
  if (btn.classList.contains("active-onboard")) {
    btn.className = "onboard-chip active-onboard p-2.5 rounded-xl border-2 text-xs font-bold border-amber-600 bg-amber-50 text-amber-900 flex flex-col items-center gap-1";
  } else {
    btn.className = "onboard-chip p-2.5 rounded-xl border-2 border-slate-200 text-xs font-medium text-slate-600 hover:border-slate-300 flex flex-col items-center gap-1";
  }
}

function selectSingleChoice(btn, category, tag) {
  const group = document.getElementById("onboardingLightingGroup");
  group.querySelectorAll(".onboard-chip").forEach(b => {
    b.className = "onboard-chip p-2.5 rounded-xl border-2 border-slate-200 text-xs font-medium text-slate-600 text-left hover:border-slate-300";
  });
  btn.className = "onboard-chip active-onboard p-2.5 rounded-xl border-2 text-xs font-bold border-amber-600 bg-amber-50 text-amber-900 text-left";
  state.onboarding.lighting = tag;
}

function applyOnboardingPreferences() {
  // Collect selected purposes
  const purposes = [];
  document.querySelectorAll("#onboardingPurposeGroup .active-onboard").forEach(b => {
    purposes.push(b.textContent.trim());
  });

  state.onboarding.purposes = purposes.length > 0 ? purposes : ['#카공/업무'];
  
  // Update banner
  document.getElementById("personaSummaryText").innerHTML = `
    현재 맞춤 온보딩: <strong class="text-amber-800 font-bold">${state.onboarding.purposes[0]} · ${state.onboarding.lighting} · #콘센트많음</strong>
  `;

  closeOnboardingModal();
  triggerConfetti();
  alert("✨ 맞춤 온보딩 취향이 저장되었습니다!\n홈 화면에 고객님의 방문 목적에 부합하는 카페가 우선 정렬됩니다.");
}

// ================= APP MODE: CONSUMER VS OWNER (소상공인 매장 관리) =================
function setAppMode(mode) {
  state.appMode = mode;
  const consumerBtn = document.getElementById("modeConsumerBtn");
  const ownerBtn = document.getElementById("modeOwnerBtn");
  const consumerView = document.getElementById("consumerView");
  const ownerView = document.getElementById("ownerView");

  if (mode === 'consumer') {
    consumerBtn.className = "px-2.5 py-1.5 rounded-lg bg-white shadow-xs font-bold text-slate-900 transition-all flex items-center gap-1";
    ownerBtn.className = "px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 transition-all flex items-center gap-1";
    consumerView.classList.remove("hidden");
    ownerView.classList.add("hidden");
  } else {
    ownerBtn.className = "px-2.5 py-1.5 rounded-lg bg-white shadow-xs font-bold text-slate-900 transition-all flex items-center gap-1";
    consumerBtn.className = "px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 transition-all flex items-center gap-1";
    ownerView.classList.remove("hidden");
    consumerView.classList.add("hidden");
    loadOwnerCafe("cafe_1");
  }
}

let currentOwnerCafeId = "cafe_1";
let currentOwnerCongestion = "chill";

function loadOwnerCafe(cafeId) {
  currentOwnerCafeId = cafeId;
  const cafe = state.cafes.find(c => c.id === cafeId);
  if (!cafe) return;

  setOwnerCongestion(cafe.congestion);
  document.getElementById("ownerSeatsSlider").value = cafe.availableSeats;
  document.getElementById("ownerSeatsValue").textContent = `${cafe.availableSeats}석 남음`;
}

function setOwnerCongestion(congestion) {
  currentOwnerCongestion = congestion;
  const btns = document.querySelectorAll(".owner-status-btn");
  btns.forEach(btn => {
    btn.className = "owner-status-btn p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all border-slate-200 text-slate-600";
  });

  const targetIdx = { chill: 0, moderate: 1, crowded: 2, full: 3 }[congestion];
  if (btns[targetIdx]) {
    const activeColor = {
      chill: "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold",
      moderate: "border-amber-500 bg-amber-50 text-amber-800 font-bold",
      crowded: "border-orange-500 bg-orange-50 text-orange-800 font-bold",
      full: "border-red-500 bg-red-50 text-red-800 font-bold"
    }[congestion];
    btns[targetIdx].className = `owner-status-btn p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${activeColor}`;
  }
}

function handleOwnerSeatsChange(val) {
  document.getElementById("ownerSeatsValue").textContent = `${val}석 남음`;
}

function saveOwnerStatus() {
  const cafe = state.cafes.find(c => c.id === currentOwnerCafeId);
  if (!cafe) return;

  const seats = parseInt(document.getElementById("ownerSeatsSlider").value);
  cafe.congestion = currentOwnerCongestion;
  cafe.congestionLabel = { chill: "여유", moderate: "보통", crowded: "혼잡", full: "만석" }[currentOwnerCongestion];
  cafe.availableSeats = seats;

  // Sync with backend API
  try {
    fetch('/api/owner/update-congestion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cafeId: cafe.id,
        congestion: cafe.congestion,
        availableSeats: seats,
        occupancyRate: Math.round(((cafe.totalSeats - seats) / cafe.totalSeats) * 100)
      })
    });
  } catch (err) {}

  renderCafeList();
  updateMapMarkers();
  triggerConfetti();
  alert(`✅ [${cafe.name}] 실시간 상태 업데이트 완료!\n\n혼잡도: ${cafe.congestionLabel}\n잔여 좌석: ${seats}석\n\n소비자 앱 지도와 목록에 즉시 반영되었습니다.`);
}

function issueFlashCoupon() {
  const title = document.getElementById("couponTitleInput").value.trim();
  const count = document.getElementById("couponCountInput").value;
  const benefit = document.getElementById("couponDiscountInput").value;

  if (!title) {
    alert("쿠폰 타이틀을 입력하세요.");
    return;
  }

  const newCoupon = {
    id: `FLASH_${Date.now()}`,
    title: title,
    expire: "2026.11.30",
    badge: "타임딜"
  };

  state.userCoupons.unshift(newCoupon);
  renderOwnerCoupons();
  updateCouponsModalList();
  triggerConfetti();

  alert(`📢 타임딜 쿠폰 발행 완료!\n타이틀: ${title}\n수량: ${count}장\n주변 500m 이내 유저들에게 타임딜 알림이 전송되었습니다.`);
}

function renderOwnerCoupons() {
  const container = document.getElementById("ownerActiveCoupons");
  if (!container) return;

  container.innerHTML = state.userCoupons.slice(0, 3).map(c => `
    <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
      <div>
        <span class="font-bold text-slate-800">${c.title}</span>
        <span class="text-[10px] text-slate-400 block">유효기간: ~ ${c.expire}</span>
      </div>
      <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">발행 중</span>
    </div>
  `).join('');
}

// Switching Map/List View
function switchView(view) {
  state.viewMode = view;
  const mapBtn = document.getElementById("viewMapBtn");
  const listBtn = document.getElementById("viewListBtn");
  const mapWrapper = document.getElementById("mapContainerWrapper");
  const listWrapper = document.getElementById("listContainerWrapper");

  if (view === 'map') {
    mapBtn.className = "px-2.5 py-1 rounded-lg bg-white shadow-xs text-slate-800 flex items-center gap-1 transition-all";
    listBtn.className = "px-2.5 py-1 rounded-lg text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-all";
    mapWrapper.className = "lg:col-span-12 bg-white rounded-3xl p-3 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col h-[600px] transition-all";
    listWrapper.className = "hidden";
    setTimeout(() => { if (state.map) state.map.invalidateSize(); }, 200);
  } else if (view === 'list') {
    listBtn.className = "px-2.5 py-1 rounded-lg bg-white shadow-xs text-slate-800 flex items-center gap-1 transition-all";
    mapBtn.className = "px-2.5 py-1 rounded-lg text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-all";
    mapWrapper.className = "hidden";
    listWrapper.className = "lg:col-span-12 flex flex-col gap-3.5 h-auto pr-1";
  } else {
    // split
    mapWrapper.className = "lg:col-span-7 bg-white rounded-3xl p-3 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col h-[520px] transition-all";
    listWrapper.className = "lg:col-span-5 flex flex-col gap-3.5 h-[520px] overflow-y-auto pr-1";
    setTimeout(() => { if (state.map) state.map.invalidateSize(); }, 200);
  }
}

function resetToHome() {
  setAppMode('consumer');
  switchView('split');
  toggleTagFilter('all');
}
