import requests
from bs4 import BeautifulSoup

def crawl_tistory(keyword: str, max_page: int = 2):
    reviews = []
    for page in range(1, max_page + 1):
        url = f"https://search.daum.net/search?w=blog&lpp=10&q={keyword}&page={page}"
        resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(resp.text, 'html.parser')
        for item in soup.select('.f_link_b'):  # 실제 selector는 다를 수 있음
            title = item.text.strip()
            link = item.get('href')
            reviews.append({"title": title, "link": link})
    return reviews

if __name__ == "__main__":
    result = crawl_tistory("우리끼리 키즈카페 대전문화점 후기")
    print(result)
