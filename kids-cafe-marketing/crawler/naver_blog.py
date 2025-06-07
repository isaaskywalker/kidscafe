import requests
from bs4 import BeautifulSoup

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
            reviews.append({"title": title, "link": link})
    return reviews

if __name__ == "__main__":
    result = crawl_naver_blog("우리끼리 키즈카페 대전문화점 후기")
    print(result)
