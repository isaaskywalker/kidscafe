import requests
from bs4 import BeautifulSoup

def crawl_naver_map(place_id: str):
    # 실제 네이버 지도 리뷰는 동적 로딩이 많아 selenium이 필요할 수 있음 (여기선 예시)
    url = f"https://map.naver.com/v5/entry/place/{place_id}"
    resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    soup = BeautifulSoup(resp.text, 'html.parser')
    # 실제 리뷰 파싱 로직은 동적 분석 필요
    reviews = []
    for item in soup.select('.some_review_selector'):
        text = item.text.strip()
        reviews.append(text)
    return reviews

if __name__ == "__main__":
    result = crawl_naver_map("PLACE_ID")
    print(result)
