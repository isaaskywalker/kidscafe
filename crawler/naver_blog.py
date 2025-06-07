import requests
from bs4 import BeautifulSoup
import datetime
import json
import os
import time

# 네이버 블로그 리뷰 크롤러 예시

def get_blog_post_date_and_content(link):
    try:
        resp = requests.get(link, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"})
        soup = BeautifulSoup(resp.text, 'html.parser')
        # 네이버 블로그 최신 구조 대응 (iframe 내부 진입 필요할 수 있음)
        # date
        date_tag = soup.select_one('span.se_publishDate, span.se_publish_time, span.date')
        date = date_tag.text.strip() if date_tag else None
        # 본문
        content_tag = soup.select_one('div.se-main-container, div#postViewArea, div.se_component_wrap')
        content = content_tag.text.strip() if content_tag else None
        return date, content
    except Exception as e:
        return None, None

def crawl_naver_blog(keyword: str, max_page: int = 3):
    reviews = []
    for page in range(1, max_page + 1):
        url = f"https://search.naver.com/search.naver?where=post&query={keyword}&start={page*10-9}"
        resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"})
        soup = BeautifulSoup(resp.text, 'html.parser')
        # 최신 네이버 검색 결과 selector (2024년 기준)
        for item in soup.select('a.api_txt_lines.total_tit'):
            title = item.get('title') or item.text.strip()
            link = item.get('href')
            # 상세 페이지 진입해서 날짜/본문 파싱
            date, content = get_blog_post_date_and_content(link)
            # 날짜 파싱 및 2024-06-01 이후만 필터
            if date:
                try:
                    date_str = date.split()[0].replace('.', '-')  # '2024.06.07.' -> '2024-06-07'
                    if date_str >= '2024-06-01':
                        reviews.append({"title": title, "link": link, "date": date_str, "content": content})
                except Exception:
                    pass
            time.sleep(0.5)  # 네이버 차단 방지 딜레이
    return reviews

def crawl_naver_blog_multi(keywords, max_page=3):
    all_reviews = []
    seen_links = set()
    for keyword in keywords:
        reviews = crawl_naver_blog(keyword, max_page)
        for r in reviews:
            if r['link'] not in seen_links:
                all_reviews.append(r)
                seen_links.add(r['link'])
    return all_reviews

def save_reviews_to_file(reviews, date_str):
    os.makedirs('data/reviews', exist_ok=True)
    path = f'data/reviews/{date_str}.json'
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(reviews, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    today = datetime.date.today().isoformat()
    keywords = [
        "우리끼리 리뷰",
        "대전문화점 리뷰",
        "우리끼리 대전문화점"
    ]
    result = crawl_naver_blog_multi(keywords)
    save_reviews_to_file(result, today)
    print(f"Saved {len(result)} reviews to data/reviews/{today}.json")
