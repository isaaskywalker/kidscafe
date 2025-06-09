import requests
from bs4 import BeautifulSoup
import datetime
import json
import os
import time
import random
import re
from sentiment import batch_analyze_reviews  # 감정 분석 모듈 import

def parse_korean_date(date_text):
    """한국어 날짜를 파싱하여 표준 형식으로 변환"""
    try:
        date_text = date_text.strip()
        
        # "2025.06.15", "2025-06-15", "2025/06/15" 형식
        if re.match(r'\d{4}[./-]\d{1,2}[./-]\d{1,2}', date_text):
            date_str = re.sub(r'[./-]', '-', date_text.split()[0])
            parts = date_str.split('-')
            if len(parts) == 3:
                year, month, day = parts
                return f"{year}-{month.zfill(2)}-{day.zfill(2)}"
        
        # "6월 15일", "2025년 6월 15일" 형식
        if '년' in date_text and '월' in date_text:
            year_match = re.search(r'(\d{4})년', date_text)
            month_match = re.search(r'(\d{1,2})월', date_text)
            day_match = re.search(r'(\d{1,2})일', date_text)
            
            year = year_match.group(1) if year_match else '2025'
            month = month_match.group(1).zfill(2) if month_match else '01'
            day = day_match.group(1).zfill(2) if day_match else '01'
            
            return f"{year}-{month}-{day}"
        
        return None
    except:
        return None

def is_recent_post(date_str, cutoff_date="2025-06-01"):
    """2025년 6월 이후 포스트인지 확인"""
    try:
        if not date_str:
            return False
        return date_str >= cutoff_date
    except:
        return False

def get_blog_post_date_and_content(link):
    """블로그 포스트의 날짜와 콘텐츠 추출"""
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3",
        }
        
        resp = requests.get(link, headers=headers, timeout=15)
        if resp.status_code != 200:
            return None, None
            
        soup = BeautifulSoup(resp.text, 'html.parser')
        
        # 날짜 추출
        date_selectors = [
            '.se-module-text .se-fs- .se-ff-',
            '.blog_date', '.post-date', '.date',
            '[class*="date"]', '[class*="time"]',
            '.se_publishDate', '.se_publish_time'
        ]
        
        date = None
        for selector in date_selectors:
            elements = soup.select(selector)
            for elem in elements:
                text = elem.get_text().strip()
                parsed_date = parse_korean_date(text)
                if parsed_date:
                    date = parsed_date
                    break
            if date:
                break
        
        # 콘텐츠 추출
        content_selectors = [
            '.se-main-container',
            '.se-component-wrap',
            '#postViewArea',
            '.post_content',
            '.blog_content',
            '[class*="content"]'
        ]
        
        content = None
        for selector in content_selectors:
            elements = soup.select(selector)
            for elem in elements:
                text = elem.get_text().strip()
                if text and len(text) > 200:
                    content = text
                    break
            if content:
                break
        
        return date, content
        
    except Exception as e:
        print(f"Error parsing {link}: {e}")
        return None, None

def crawl_naver_blog(keyword: str, max_page: int = 3):
    """네이버 블로그 크롤링 (2025년 6월 이후만)"""
    reviews = []
    
    for page in range(1, max_page + 1):
        print(f"📄 Crawling page {page} for keyword: {keyword}")
        
        start = (page - 1) * 10 + 1
        url = f"https://search.naver.com/search.naver?where=post&sm=tab_jum&query={keyword}&start={start}"
        
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer": "https://www.naver.com"
        }
        
        try:
            resp = requests.get(url, headers=headers, timeout=10)
            if resp.status_code != 200:
                continue
                
            soup = BeautifulSoup(resp.text, 'html.parser')
            items = soup.select('.total_tit a.link_tit')
            
            print(f"🔍 Found {len(items)} items")
            
            for i, item in enumerate(items[:5]):
                title = item.get('title') or item.text.strip()
                link = item.get('href')
                
                if not link or not title or 'blog.naver.com' not in link:
                    continue
                
                print(f"📝 Processing: {title[:40]}...")
                
                # 블로그 상세 정보 가져오기
                date, content = get_blog_post_date_and_content(link)
                
                if not date or not content:
                    print("❌ Failed to get date/content")
                    continue
                
                # 2025년 6월 이후만 필터링
                if not is_recent_post(date, "2025-06-01"):
                    print(f"❌ Too old: {date}")
                    continue
                
                print(f"✅ Recent post found: {date}")
                
                review = {
                    "title": title,
                    "link": link,
                    "date": date,
                    "content": content[:1000]  # 첫 1000자
                }
                
                reviews.append(review)
                print(f"✅ Added review: {title[:30]}...")
                
                time.sleep(random.uniform(1, 2))
                
        except Exception as e:
            print(f"Error on page {page}: {e}")
        
        time.sleep(random.uniform(2, 4))
    
    return reviews

def crawl_naver_blog_multi(keywords, max_page=2):
    """여러 키워드로 크롤링"""
    all_reviews = []
    seen_links = set()
    
    for keyword in keywords:
        print(f"\n=== 🔍 Crawling: {keyword} ===")
        reviews = crawl_naver_blog(keyword, max_page)
        
        # 중복 제거
        for review in reviews:
            if review['link'] not in seen_links:
                all_reviews.append(review)
                seen_links.add(review['link'])
    
    return all_reviews

def save_reviews_to_file(reviews, date_str):
    """리뷰 데이터를 파일로 저장"""
    os.makedirs('data/reviews', exist_ok=True)
    path = f'data/reviews/{date_str}.json'
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(reviews, f, ensure_ascii=False, indent=2)
    print(f"✅ Reviews saved to: {path}")
    return path

if __name__ == "__main__":
    print("🚀 Starting crawler...")
    today = datetime.date.today().isoformat()
    
    keywords = [
        "우리끼리 키즈카페 대전문화점",
        "우리끼리 대전문화점 리뷰"
    ]
    
    try:
        # 1. 크롤링 실행
        reviews = crawl_naver_blog_multi(keywords, max_page=2)
        print(f"\n📊 총 {len(reviews)}개의 최신 리뷰 수집 완료")
        
        if not reviews:
            print("❌ 수집된 리뷰가 없습니다.")
            exit()
        
        # 2. 감정 분석 추가
        print("🤖 감정 분석 중...")
        analyzed_reviews = batch_analyze_reviews(reviews)
        
        # 3. 결과 저장
        save_path = save_reviews_to_file(analyzed_reviews, today)
        
        # 4. 결과 미리보기
        print("\n" + "="*60)
        print("📊 크롤링 & 분석 결과")
        print("="*60)
        
        for i, review in enumerate(analyzed_reviews[:3], 1):
            print(f"\n--- 리뷰 {i} ---")
            print(f"제목: {review['title']}")
            print(f"날짜: {review['date']}")
            print(f"감정: {review['sentiment']} (신뢰도: {review['sentiment_confidence']})")
            print(f"근거: {review['sentiment_reasoning']}")
            print(f"내용: {review['content'][:100]}...")
        
        print(f"\n✅ 완료! 데이터 저장 위치: {save_path}")
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
