"""
Cafe 101 - Backend Server & API Mock
Lightweight HTTP Server with REST API support for Cafe 101 application.
Can be executed with: python server.py
"""
import http.server
import socketserver
import json
import urllib.parse
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# In-memory mock database
CAFES = [
    {
        "id": "cafe_1",
        "name": "오츠에스프레소 성수점",
        "category": "스페셜티 커피 & 아인슈페너",
        "area": "서울 성동구 성수동",
        "distance": "180m",
        "walkTime": "3분",
        "lat": 37.5446,
        "lng": 127.0560,
        "congestion": "chill",  # chill(여유), moderate(보통), crowded(혼잡), full(만석)
        "congestionLabel": "여유",
        "occupancyRate": 38,
        "availableSeats": 14,
        "totalSeats": 24,
        "rating": 4.8,
        "trueRating": 4.5,
        "reviewCount": 384,
        "rawReviewCount": 142,
        "tags": ["#카공/업무", "#콘센트많음", "#어두운조명", "#쾌적한내부화장실", "#아인슈페너맛집"],
        "atmosphere": "어두운조명",
        "brightnessScore": 2, # 1: 딤/어두움, 5: 매우밝음
        "noiseLevel": 2, # 1: 무소음, 5: 활기참
        "outletRatio": 85, # %
        "restroom": "매장 내부 (남녀분리, 쾌적)",
        "parking": "불가 (인근 유료공영주차장 도보 2분)",
        "petFriendly": True,
        "img": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
        "description": "묵직하고 크리미한 아인슈페너와 차분하고 짙은 우드톤의 조명. 카공과 독서에 몰입하기 좋은 성수동의 히든 플레이스.",
        "signatureMenu": [
            {"name": "시그니처 아인슈페너", "price": "6,500원", "desc": "직접 제조한 쫀득한 수제 생크림과 진한 에스프레소", "popular": True},
            {"name": "오츠 블렌드 드립커피", "price": "6,000원", "desc": "다크초콜릿의 단맛과 묵직한 바디감", "popular": False},
            {"name": "수제 버터 스콘", "price": "4,500원", "desc": "프랑스산 고메버터로 매일 아침 구워내는 스콘", "popular": True}
        ],
        "hourlyCongestion": [
            {"hour": "09:00", "rate": 15},
            {"hour": "11:00", "rate": 28},
            {"hour": "13:00", "rate": 65},
            {"hour": "15:00", "rate": 45},
            {"hour": "17:00", "rate": 38},
            {"hour": "19:00", "rate": 55},
            {"hour": "21:00", "rate": 30}
        ],
        "seats": [
            {"id": "S1", "type": "창가 1인석", "outlet": True, "occupied": False},
            {"id": "S2", "type": "창가 1인석", "outlet": True, "occupied": False},
            {"id": "S3", "type": "창가 1인석", "outlet": True, "occupied": True},
            {"id": "S4", "type": "2인 테이블", "outlet": True, "occupied": False},
            {"id": "S5", "type": "2인 테이블", "outlet": False, "occupied": True},
            {"id": "S6", "type": "4인 롱테이블", "outlet": True, "occupied": False},
            {"id": "S7", "type": "4인 롱테이블", "outlet": True, "occupied": False},
            {"id": "S8", "type": "쇼파석", "outlet": False, "occupied": True}
        ],
        "cleanReviews": [
            {"author": "성수러버", "rating": 5, "date": "2026.11.20", "content": "아인슈페너 크림이 예술이에요! 조용해서 책 읽기에도 정말 좋아요.", "photos": ["https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=300&q=80"]},
            {"author": "커피한잔", "rating": 5, "date": "2026.11.18", "content": "인테리어가 감각적이고 매장 내부 화장실이 호텔처럼 깨끗해서 마음에 듭니다.", "photos": []}
        ],
        "rawReviews": [
            {"author": "팩트폭격기", "rating": 3.8, "date": "2026.11.21", "content": "커피 맛과 크림은 상위 1% 인정. 근데 주말 오후 2시 넘으면 만석이고 웨이팅 심해서 카공 불가능함. 평일 오전 방문 강력 추천. 창가 3번 좌석은 에어컨 직타석이라 추움.", "tags": ["#주말웨이팅극심", "#평일추천", "#커피맛최고", "#3번좌석춥다"]},
            {"author": "노트북작업러", "rating": 4.5, "date": "2026.11.15", "content": "콘센트는 넉넉한데 원목 의자가 2시간 넘어가면 엉덩이 아픕니다. 방석 챙겨오시면 최적의 작업 공간임. 화장실 디퓨저 향 좋음.", "tags": ["#의자살짝딱딱", "#콘센트굿", "#화장실깔끔"]}
        ]
    },
    {
        "id": "cafe_2",
        "name": "카페 어반사일런스",
        "category": "하이엔드 워크 & 스터디 카페",
        "area": "서울 성동구 뚝섬로",
        "distance": "250m",
        "walkTime": "4분",
        "lat": 37.5458,
        "lng": 127.0545,
        "congestion": "full",
        "congestionLabel": "만석",
        "occupancyRate": 98,
        "availableSeats": 0,
        "totalSeats": 35,
        "rating": 4.9,
        "trueRating": 4.2,
        "reviewCount": 512,
        "rawReviewCount": 210,
        "tags": ["#카공/업무", "#콘센트많음", "#어두운조명", "#쾌적한내부화장실", "#독서실급정숙"],
        "atmosphere": "어두운조명",
        "brightnessScore": 2,
        "noiseLevel": 1,
        "outletRatio": 100,
        "restroom": "매장 내부 남녀분리 (다이슨 핸드드라이어 완비)",
        "parking": "기계식 주차 2시간 무료",
        "petFriendly": False,
        "img": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
        "description": "전 좌석 초고속 기가와이파이 및 듀얼 콘센트 완비. 집중력 극대화되는 핀조명과 백색소음 시스템.",
        "signatureMenu": [
            {"name": "사일런스 콜드브루", "price": "5,500원", "desc": "산미 없이 깔끔한 18시간 저온 추출 콜드브루", "popular": True},
            {"name": "오트 바닐라 라떼", "price": "6,500원", "desc": "식물성 오틀리 우유와 마다가스카르 바닐라빈", "popular": True}
        ],
        "hourlyCongestion": [
            {"hour": "09:00", "rate": 40},
            {"hour": "11:00", "rate": 70},
            {"hour": "13:00", "rate": 95},
            {"hour": "15:00", "rate": 98},
            {"hour": "17:00", "rate": 90},
            {"hour": "19:00", "rate": 75},
            {"hour": "21:00", "rate": 45}
        ],
        "seats": [
            {"id": "A1", "type": "독서실형 1인석", "outlet": True, "occupied": True},
            {"id": "A2", "type": "독서실형 1인석", "outlet": True, "occupied": True},
            {"id": "A3", "type": "독서실형 1인석", "outlet": True, "occupied": True},
            {"id": "A4", "type": "독서실형 1인석", "outlet": True, "occupied": True}
        ],
        "cleanReviews": [
            {"author": "개발자H", "rating": 5, "date": "2026.11.22", "content": "와이파이 속도 미쳤고 소음 관리 너무 잘 됩니다. 집중 끝판왕.", "photos": []}
        ],
        "rawReviews": [
            {"author": "익명리뷰어", "rating": 3.5, "date": "2026.11.19", "content": "현재 평일 오후에도 자리 잡기 하늘의 별따기입니다. 만석 알림 안보고 갔다가 40분 대기함. 앱 실시간 좌석 꼭 확인하고 오세요. 키보드 타이핑 소리 눈치보일 정도로 조용함.", "tags": ["#자리잡기극악", "#키보드눈치", "#완전조용"]}
        ]
    },
    {
        "id": "cafe_3",
        "name": "루미에르 성수 가든",
        "category": "유행 디저트 & 로맨틱 데이트",
        "area": "서울 성동구 서울숲길",
        "distance": "320m",
        "walkTime": "5분",
        "lat": 37.5432,
        "lng": 127.0532,
        "congestion": "moderate",
        "congestionLabel": "보통",
        "occupancyRate": 65,
        "availableSeats": 9,
        "totalSeats": 28,
        "rating": 4.7,
        "trueRating": 4.4,
        "reviewCount": 420,
        "rawReviewCount": 185,
        "tags": ["#데이트", "#유행디저트", "#밝은조명", "#쾌적한내부화장실", "#인스타감성"],
        "atmosphere": "밝은조명",
        "brightnessScore": 5,
        "noiseLevel": 3,
        "outletRatio": 30,
        "restroom": "매장 내부 남녀분리 (파우더룸 구비)",
        "parking": "발렛 파킹 가능 (3천원)",
        "petFriendly": True,
        "img": "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=600&q=80",
        "description": "자연 채광 가득한 통창 뷰와 생화 플랜테리어. 두바이 초콜릿 크루키와 생토노레 디저트 맛집.",
        "signatureMenu": [
            {"name": "두바이 피스타치오 크루키", "price": "7,800원", "desc": "바삭한 카다이프와 수제 피스타치오 스프레드", "popular": True},
            {"name": "피치 블라썸 에이드", "price": "7,000원", "desc": "직접 담근 유기농 백도 복숭아 청과 히비스커스", "popular": True}
        ],
        "hourlyCongestion": [
            {"hour": "11:00", "rate": 20},
            {"hour": "13:00", "rate": 70},
            {"hour": "15:00", "rate": 80},
            {"hour": "17:00", "rate": 65},
            {"hour": "19:00", "rate": 50}
        ],
        "seats": [
            {"id": "G1", "type": "테라스 가든석", "outlet": False, "occupied": False},
            {"id": "G2", "type": "통창 2인 테이블", "outlet": False, "occupied": True},
            {"id": "G3", "type": "원형 쇼파석", "outlet": True, "occupied": False}
        ],
        "cleanReviews": [
            {"author": "소담", "rating": 5, "date": "2026.11.20", "content": "데이트하기에 분위기 진짜 최고예요! 디저트 비주얼 사진 대박 잘나와요.", "photos": []}
        ],
        "rawReviews": [
            {"author": "솔직미식가", "rating": 4.1, "date": "2026.11.16", "content": "크루키는 정말 맛있는데 음료 가격대가 다소 높고, 주말엔 사진 찍는 사람들로 조금 어수선합니다. 콘센트 자리가 거의 없어서 작업 목적으론 비추천, 데이트엔 굿.", "tags": ["#콘센트부족", "#데이트강추", "#디저트맛도리", "#가격대높음"]}
        ]
    },
    {
        "id": "cafe_4",
        "name": "포레스트 라운지 (추천 대체 카페)",
        "category": "조용한 로스터리 & 모던 카공",
        "area": "서울 성동구 아차산로",
        "distance": "220m",
        "walkTime": "3분",
        "lat": 37.5451,
        "lng": 127.0578,
        "congestion": "chill",
        "congestionLabel": "여유",
        "occupancyRate": 25,
        "availableSeats": 22,
        "totalSeats": 30,
        "rating": 4.6,
        "trueRating": 4.6,
        "reviewCount": 180,
        "rawReviewCount": 88,
        "tags": ["#카공/업무", "#콘센트많음", "#어두운조명", "#쾌적한내부화장실", "#숨은명소"],
        "atmosphere": "어두운조명",
        "brightnessScore": 2,
        "noiseLevel": 2,
        "outletRatio": 90,
        "restroom": "매장 내부 남녀분리 (상시 청결 유지)",
        "parking": "매장 앞 2대 주차 가능",
        "petFriendly": True,
        "img": "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=80",
        "description": "성수의 숨겨진 보석. 넓은 원목 테이블마다 콘센트가 구비되어 있고, 잔잔한 재즈 음악이 흐르는 여유로운 공간.",
        "signatureMenu": [
            {"name": "싱글오리진 필터 드립", "price": "6,000원", "desc": "에티오피아 예가체프의 화사한 꽃향기", "popular": True},
            {"name": "바스크 치즈케이크", "price": "6,800원", "desc": "끼리 크림치즈로 만든 겉바속촉 치즈케이크", "popular": True}
        ],
        "hourlyCongestion": [
            {"hour": "10:00", "rate": 10},
            {"hour": "12:00", "rate": 25},
            {"hour": "14:00", "rate": 35},
            {"hour": "16:00", "rate": 25},
            {"hour": "18:00", "rate": 20}
        ],
        "seats": [
            {"id": "F1", "type": "창가 1인석", "outlet": True, "occupied": False},
            {"id": "F2", "type": "1인석", "outlet": True, "occupied": False},
            {"id": "F3", "type": "4인 테이블", "outlet": True, "occupied": False}
        ],
        "cleanReviews": [
            {"author": "성수방랑자", "rating": 5, "date": "2026.11.19", "content": "근처 카페 다 만석이었는데 카페101 추천으로 찾았어요. 자리 널널하고 커피 존맛탱!", "photos": []}
        ],
        "rawReviews": [
            {"author": "광고극혐러", "rating": 4.7, "date": "2026.11.14", "content": "골목 안쪽에 있어서 아직 덜 알려져서 진짜 평화로움. 콘센트 자리 널려있고 사장님 친절함. 나만 알고 싶은 아지트.", "tags": ["#숨은맛집", "#여유로움", "#콘센트천국"]}
        ]
    }
]

REVIEWS_DB = []
COUPONS_DB = [
    {"id": "CP1", "title": "오츠에스프레소 아메리카노 1+1 쿠폰", "expire": "2026.12.31", "badge": "리뷰 작성 보상"},
    {"id": "CP2", "title": "루미에르 가든 디저트 20% 할인 쿠폰", "expire": "2026.12.15", "badge": "사장님 타임딜"}
]

class CafeHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS for local testing
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/api/cafes":
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps(CAFES, ensure_ascii=False).encode('utf-8'))
            return
        elif path == "/api/coupons":
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps(COUPONS_DB, ensure_ascii=False).encode('utf-8'))
            return

        # Serve static files from DIRECTORY
        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        content_len = int(self.headers.get('Content-Length', 0))
        post_body = self.rfile.read(content_len).decode('utf-8') if content_len > 0 else "{}"
        
        try:
            data = json.loads(post_body)
        except Exception:
            data = {}

        if path == "/api/reviews":
            # Add review & grant 500 points
            review = {
                "cafeId": data.get("cafeId", "cafe_1"),
                "author": data.get("author", "방문인증유저"),
                "rating": data.get("rating", 5),
                "content": data.get("content", ""),
                "tags": data.get("tags", []),
                "photos": data.get("photos", []),
                "date": "2026.11.23",
                "verified": True
            }
            REVIEWS_DB.append(review)
            
            # Also append to cafe's rawReviews
            for c in CAFES:
                if c["id"] == review["cafeId"]:
                    c["rawReviews"].insert(0, review)
                    c["reviewCount"] += 1
                    c["rawReviewCount"] += 1
                    break

            res = {
                "success": True,
                "message": "사진 리뷰가 등록되었습니다!",
                "rewardPoints": 500,
                "coupon": "무료 아메리카노 응모권 지급 완료",
                "review": review
            }
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps(res, ensure_ascii=False).encode('utf-8'))
            return

        elif path == "/api/owner/update-congestion":
            # Cafe Owner updates congestion status
            cafe_id = data.get("cafeId")
            new_congestion = data.get("congestion") # chill, moderate, crowded, full
            new_rate = data.get("occupancyRate", 50)
            new_avail = data.get("availableSeats", 10)

            labels = {"chill": "여유", "moderate": "보통", "crowded": "혼잡", "full": "만석"}
            updated_cafe = None
            for c in CAFES:
                if c["id"] == cafe_id:
                    c["congestion"] = new_congestion
                    c["congestionLabel"] = labels.get(new_congestion, "보통")
                    c["occupancyRate"] = new_rate
                    c["availableSeats"] = new_avail
                    updated_cafe = c
                    break

            res = {"success": True, "cafe": updated_cafe}
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps(res, ensure_ascii=False).encode('utf-8'))
            return

        self.send_response(404)
        self.end_headers()

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), CafeHandler) as httpd:
        print(f"[Cafe 101] Server running on http://localhost:{PORT}")
        print("Press Ctrl+C to terminate.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
