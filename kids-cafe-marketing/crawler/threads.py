# Threads 크롤러는 공식 API가 없으므로, 실제 운영 시 별도 라이브러리/selenium 필요
# 아래는 구조 예시입니다.

def crawl_threads(keyword: str, max_count: int = 10):
    posts = []
    # 예시 데이터
    for i in range(max_count):
        posts.append({
            "user": f"user{i}",
            "content": f"{keyword} 관련 Threads 게시글 {i}",
            "link": f"https://www.threads.net/@user{i}/post/example{i}"
        })
    return posts

if __name__ == "__main__":
    result = crawl_threads("우리끼리 키즈카페 대전문화점")
    print(result)
