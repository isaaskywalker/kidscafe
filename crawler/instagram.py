# 인스타그램 크롤러는 공식 API가 없으므로, 실제 운영 시 instaloader 등 별도 라이브러리 필요
# 아래는 구조 예시입니다.

def crawl_instagram(hashtag: str, max_count: int = 10):
    # 실제 구현은 instaloader, selenium 등 활용 필요
    posts = []
    # 예시 데이터
    for i in range(max_count):
        posts.append({
            "user": f"user{i}",
            "content": f"{hashtag} 관련 게시글 내용 {i}",
            "link": f"https://instagram.com/p/example{i}"
        })
    return posts

if __name__ == "__main__":
    result = crawl_instagram("우리끼리키즈카페대전문화점")
    print(result)
