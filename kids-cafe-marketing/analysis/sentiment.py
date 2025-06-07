# 한글 리뷰 감정 분석 예시
# 실제 운영 시 transformers, pororo, konlpy 등 활용

def analyze_sentiment(text: str) -> str:
    """
    입력된 텍스트의 감정을 분석하여 'positive', 'negative', 'neutral' 중 하나를 반환합니다.
    (여기서는 예시로 단순 분류)
    """
    if '좋다' in text or '추천' in text or '깨끗' in text:
        return 'positive'
    elif '별로' in text or '불편' in text or '아쉽' in text:
        return 'negative'
    else:
        return 'neutral'

if __name__ == "__main__":
    print(analyze_sentiment("시설이 깨끗하고 좋아요!"))
    print(analyze_sentiment("주차가 불편했어요."))
    print(analyze_sentiment("그냥 그랬어요."))
