import requests
from bs4 import BeautifulSoup
import datetime
import json
import os

def crawl_tistory(keyword: str, max_page: int = 2):
    reviews = []
    for page in range(1, max_page + 1):
        url = f"https://search.daum.net/search?w=blog&lpp=10&q={keyword}&page={page}"
        resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(resp.text, 'html.parser')
        for item in soup.select('.f_link_b'):  # 실제 selector는 다를 수 있음
            title = item.text.strip()
            link = item.get('href')
            date = datetime.date.today().isoformat()  # 실제 구현 시 리뷰 날짜 파싱 필요
            if date >= '2024-06-01':
                reviews.append({"title": title, "link": link, "date": date})
    return reviews

def save_reviews_to_file(reviews, date_str):
    os.makedirs('data/reviews', exist_ok=True)
    path = f'data/reviews/{date_str}_tistory.json'
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(reviews, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    today = datetime.date.today().isoformat()
    result = crawl_tistory("우리끼리 키즈카페 대전문화점 후기")
    save_reviews_to_file(result, today)
    print(f"Saved {len(result)} reviews to data/reviews/{today}_tistory.json")
