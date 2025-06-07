import requests
from bs4 import BeautifulSoup
import datetime
import json
import os

# 네이버 블로그 리뷰 크롤러 예시

def crawl_naver_blog(keyword: str, max_page: int = 3):
    reviews = []
    for page in range(1, max_page + 1):
        url = f"https://search.naver.com/search.naver?where=post&query={keyword}&start={page*10-9}"
        resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(resp.text, 'html.parser')
        for item in soup.select('.sh_blog_title'):
            title = item.get('title')
            link = item.get('href')
            # 날짜 파싱 (예시: 실제로는 상세 페이지에서 파싱 필요)
            date = datetime.date.today().isoformat()  # 실제 구현 시 상세 페이지에서 날짜 추출 필요
            if date >= '2024-06-01':
                reviews.append({"title": title, "link": link, "date": date})
    return reviews

def save_reviews_to_file(reviews, date_str):
    os.makedirs('data/reviews', exist_ok=True)
    path = f'data/reviews/{date_str}.json'
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(reviews, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    today = datetime.date.today().isoformat()
    result = crawl_naver_blog("우리끼리 키즈카페 대전문화점 후기")
    save_reviews_to_file(result, today)
    print(f"Saved {len(result)} reviews to data/reviews/{today}.json")
