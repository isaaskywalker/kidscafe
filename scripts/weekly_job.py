from crawler.naver_blog import crawl_naver_blog
from crawler.naver_map import crawl_naver_map
from crawler.tistory import crawl_tistory
from crawler.instagram import crawl_instagram
from crawler.threads import crawl_threads
from analysis.sentiment import analyze_sentiment
from analysis.trend import analyze_trend
from analysis.strategy import generate_strategy
import datetime

# 1. 리뷰 크롤링
blog_reviews = crawl_naver_blog("우리끼리 키즈카페 대전문화점 후기")
map_reviews = crawl_naver_map("PLACE_ID")
tistory_reviews = crawl_tistory("우리끼리 키즈카페 대전문화점 후기")
insta_posts = crawl_instagram("우리끼리키즈카페대전문화점")
threads_posts = crawl_threads("우리끼리 키즈카페 대전문화점")

# 2. 리뷰 통합 및 감정 분석
all_reviews = blog_reviews + [{"content": r} for r in map_reviews] + tistory_reviews + insta_posts + threads_posts
for r in all_reviews:
    r['sentiment'] = analyze_sentiment(r.get('content', r.get('title', '')))

# 3. 날짜별로 정리 (예시: 오늘 날짜)
today = datetime.date.today().isoformat()
reviews_by_date = {today: all_reviews}

# 4. 트렌드 분석
trend = analyze_trend(reviews_by_date)

# 5. 키워드 추출 (예시)
keywords = {'positive': ['깨끗함', '친절'], 'negative': ['주차']}

# 6. 마케팅 전략 생성
strategy = generate_strategy(trend, keywords)

# 7. 결과 출력 (실제 운영 시 파일 저장)
print("[리뷰 수집 및 분석 결과]")
print(trend)
print("[마케팅 전략 제안]")
print(strategy)
