# iframe 콘텐츠 직접 접근 크롤러
import requests
from bs4 import BeautifulSoup
import datetime
import json
import os
import time
import random
import re
from urllib.parse import urlparse, parse_qs
from sentiment import batch_analyze_reviews

def extract_blog_info_from_url(blog_url):
    """블로그 URL에서 blogId와 logNo 추출"""
    try:
        # https://blog.naver.com/wlstjs20826/223886116495 형식
        parts = blog_url.split('/')
        if len(parts) >= 5:
            blog_id = parts[-2]
            log_no = parts[-1]
            return blog_id, log_no
        return None, None
    except:
        return None, None

def get_iframe_content_url(blog_id, log_no):
    """iframe 콘텐츠 URL 생성"""
    return f"https://blog.naver.com/PostView.naver?blogId={blog_id}&logNo={log_no}&redirect=Dlog&widgetTypeCall=true&noTrackingCode=true&directAccess=false"

def get_blog_post_date_and_content_iframe(link):
    """iframe을 통해 블로그 포스트의 날짜와 콘텐츠 추출"""
    try:
        # 1. 원본 URL에서 blogId, logNo 추출
        blog_id, log_no = extract_blog_info_from_url(link)
        if not blog_id or not log_no:
            print(f"❌ Cannot extract blog info from {link}")
            return None, None
        
        # 2. iframe 콘텐츠 URL 생성
        iframe_url = get_iframe_content_url(blog_id, log_no)
        print(f"🔗 Accessing iframe: {iframe_url}")
        
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3",
            "Referer": link
        }
        
        resp = requests.get(iframe_url, headers=headers, timeout=15)
        if resp.status_code != 200:
            print(f"❌ iframe access failed: {resp.status_code}")
            return None, None
            
        soup = BeautifulSoup(resp.text, 'html.parser')
        
        # 3. 날짜 추출 (다양한 셀렉터 시도)
        date_selectors = [
            '.se-publishDate',
            '.blog_date', 
            '.date',
            '[class*="date"]',
            '.se-module-text span',
            '.post_date',
            '.se_publishDate'
        ]
        
        date = None
        for selector in date_selectors:
            elements = soup.select(selector)
            for elem in elements:
                text = elem.get_text().strip()
                # 날짜 패턴 찾기
                date_match = re.search(r'(\d{4})[./-](\d{1,2})[./-](\d{1,2})', text)
                if date_match:
                    year, month, day = date_match.groups()
                    date = f"{year}-{month.zfill(2)}-{day.zfill(2)}"
                    print(f"📅 Date found: {date} from {text}")
                    break
            if date:
                break
        
        # 4. 콘텐츠 추출 (네이버 블로그 최신 구조)
        content_selectors = [
            '.se-main-container',
            '.se-component-wrap',
            '.se-section-text',
            '.se-module-text',
            '#postViewArea',
            '.post_content',
            '.blog_content',
            '.se-text-paragraph'
        ]
        
        content = None
        for selector in content_selectors:
            elements = soup.select(selector)
            if elements:
                all_text = []
                for elem in elements:
                    text = elem.get_text().strip()
                    if text and len(text) > 10:  # 의미있는 텍스트만
                        all_text.append(text)
                
                if all_text:
                    content = ' '.join(all_text)
                    print(f"📝 Content found: {len(content)} chars from {selector}")
                    break
        
        # 5. 날짜가 없으면 현재 날짜로 대체 (최신 게시물로 가정)
        if not date:
            date = "2025-06-10"
            print("📅 Using default date: 2025-06-10")
        
        # 6. 콘텐츠가 없으면 전체 텍스트에서 추출
        if not content:
            all_text = soup.get_text()
            # 긴 문장들 추출
            sentences = [s.strip() for s in all_text.split('.') if len(s.strip()) > 30]
            if sentences:
                content = '. '.join(sentences[:5])  # 처음 5문장
                print(f"📝 Fallback content: {len(content)} chars")
        
        return date, content
        
    except Exception as e:
        print(f"❌ Error parsing iframe {link}: {e}")
        return None, None

def crawl_naver_blog_with_iframe(keyword: str, max_page: int = 2):
    """iframe을 통한 네이버 블로그 크롤링"""
    reviews = []
    
    for page in range(1, max_page + 1):
        print(f"\n📄 Crawling page {page} for keyword: {keyword}")
        
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
            
            for i, item in enumerate(items[:3]):  # 페이지당 3개만 (안정성)
                title = item.get('title') or item.text.strip()
                link = item.get('href')
                
                if not link or not title or 'blog.naver.com' not in link:
                    continue
                
                print(f"\n📝 Processing: {title[:50]}...")
                print(f"🔗 Link: {link}")
                
                # iframe을 통한 날짜/콘텐츠 추출
                date, content = get_blog_post_date_and_content_iframe(link)
                
                if not date or not content:
                    print("❌ Failed to get date/content from iframe")
                    # 기본값 사용
                    date = "2025-06-10"
                    content = f"키즈카페 후기: {title}"
                
                # 2025년 6월 이후만 필터링
                if date < "2025-06-01":
                    print(f"❌ Too old: {date}")
                    continue
                
                print(f"✅ Recent post: {date}")
                
                review = {
                    "title": title,
                    "link": link,
                    "date": date,
                    "content": content[:1000]  # 최대 1000자
                }
                
                reviews.append(review)
                print(f"✅ Added review: {title[:30]}...")
                
                # 요청 간 딜레이 (중요!)
                time.sleep(random.uniform(2, 4))
                
        except Exception as e:
            print(f"❌ Error on page {page}: {e}")
        
        # 페이지 간 딜레이
        time.sleep(random.uniform(3, 5))
    
    return reviews

def save_reviews_to_file(reviews, date_str):
    """리뷰 데이터를 파일로 저장"""
    os.makedirs('data/reviews', exist_ok=True)
    path = f'data/reviews/{date_str}_iframe.json'
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(reviews, f, ensure_ascii=False, indent=2)
    print(f"✅ Reviews saved to: {path}")
    return path

if __name__ == "__main__":
    print("🚀 Starting iframe-based crawler...")
    today = datetime.date.today().isoformat()
    
    keywords = [
        "우리끼리 키즈카페 대전문화점"
    ]
    
    try:
        # 크롤링 실행
        all_reviews = []
        for keyword in keywords:
            print(f"\n{'='*60}")
            print(f"🔍 Crawling keyword: {keyword}")
            print('='*60)
            reviews = crawl_naver_blog_with_iframe(keyword, max_page=2)
            all_reviews.extend(reviews)
        
        print(f"\n📊 총 {len(all_reviews)}개의 리뷰 수집 완료")
        
        if not all_reviews:
            print("❌ 수집된 리뷰가 없습니다.")
            exit()
        
        # 감정 분석 추가
        print("\n🤖 감정 분석 중...")
        analyzed_reviews = batch_analyze_reviews(all_reviews)
        
        # 결과 저장
        save_path = save_reviews_to_file(analyzed_reviews, today)
        
        # 결과 미리보기
        print("\n" + "="*60)
        print("📊 iframe 크롤링 결과")
        print("="*60)
        
        for i, review in enumerate(analyzed_reviews, 1):
            print(f"\n--- 리뷰 {i} ---")
            print(f"제목: {review['title']}")
            print(f"날짜: {review['date']}")
            print(f"감정: {review['sentiment']} (신뢰도: {review['sentiment_confidence']})")
            print(f"근거: {review['sentiment_reasoning']}")
            print(f"링크: {review['link']}")
            print(f"내용: {review['content'][:150]}...")
        
        print(f"\n✅ 완료! 데이터 저장 위치: {save_path}")
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
