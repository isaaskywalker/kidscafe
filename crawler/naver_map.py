import requests
from bs4 import BeautifulSoup
import datetime
import json
import os

def crawl_naver_map(place_id: str):
    # 실제 네이버 지도 리뷰는 동적 로딩이 많아 selenium이 필요할 수 있음 (여기선 예시)
    url = f"https://map.naver.com/v5/entry/place/{place_id}"
    resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    soup = BeautifulSoup(resp.text, 'html.parser')
    # 실제 리뷰 파싱 로직은 동적 분석 필요
    reviews = []
    for item in soup.select('.some_review_selector'):
        text = item.text.strip()
        date = datetime.date.today().isoformat()  # 실제 구현 시 리뷰 날짜 파싱 필요
        if date >= '2024-06-01':
            reviews.append({"content": text, "date": date})
    return reviews

def save_reviews_to_file(reviews, date_str):
    os.makedirs('data/reviews', exist_ok=True)
    path = f'data/reviews/{date_str}_naver_map.json'
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(reviews, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    today = datetime.date.today().isoformat()
    result = crawl_naver_map("PLACE_ID")
    save_reviews_to_file(result, today)
    print(f"Saved {len(result)} reviews to data/reviews/{today}_naver_map.json")
