# Threads 크롤러는 공식 API가 없으므로, 실제 운영 시 별도 라이브러리/selenium 필요
# 아래는 구조 예시입니다.

import datetime
import json
import os

def crawl_threads(keyword: str, max_count: int = 10):
    posts = []
    for i in range(max_count):
        date = datetime.date.today().isoformat()  # 실제 구현 시 게시글 날짜 파싱 필요
        if date >= '2024-06-01':
            posts.append({
                "user": f"user{i}",
                "content": f"{keyword} 관련 Threads 게시글 {i}",
                "link": f"https://www.threads.net/@user{i}/post/example{i}",
                "date": date
            })
    return posts

def save_posts_to_file(posts, date_str):
    os.makedirs('data/reviews', exist_ok=True)
    path = f'data/reviews/{date_str}_threads.json'
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    today = datetime.date.today().isoformat()
    result = crawl_threads("우리끼리 키즈카페 대전문화점")
    save_posts_to_file(result, today)
    print(f"Saved {len(result)} posts to data/reviews/{today}_threads.json")
